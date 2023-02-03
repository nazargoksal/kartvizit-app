import { Component, Inject, OnInit } from '@angular/core';
import { from } from 'rxjs';
import{FormBuilder, FormGroup, Validators} from '@angular/forms';
import { CardService } from 'src/app/services/card.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Card } from 'src/app/models/card';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-card-modal',
  templateUrl: './card-modal.component.html',
  styleUrls: ['./card-modal.component.css']
})
export class CardModalComponent implements OnInit{
  
  cardForm!: FormGroup;
  showSpinner: boolean= false;

  constructor(
    private dialogREF: MatDialogRef<CardModalComponent>,
    private fb: FormBuilder,
    private cardService: CardService,
    private _snackBar: MatSnackBar,
    private snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: Card
  ){}
  ngOnInit(): void {
    console.log(this.data);
    this.cardForm= this.fb.group({
      name: [this.data?.name||'',Validators.maxLength(50)],
      title: [this.data?.title||'',[Validators.required,Validators.maxLength(255)]],
      phone:  [this.data?.phone||'',[Validators.required,Validators.maxLength(20)]],
      email: [this.data?.email||'',[Validators.email,Validators.maxLength(50)]],
      address: [this.data?.address||'', Validators.maxLength(255)],
    });
  }

  addCard(): void{
    this.showSpinner=true;
    this.cardService.addCard(this.cardForm.value).subscribe((res:any) =>{
      console.log(res);
      this.getSuccsess(res || 'Kartvizit başarıyla eklendi.')
    },(err:any)=>{
      this.getError(err.message ||'kartvizit eklenirken hata oluştu');
    });
  }

  updateCard(): void{
    this.cardService.updateCard(this.cardForm.value, this.data.id)
    .subscribe((res: any)=>{
      this.getSuccsess(res || 'Kartvizit başarıyla güncellendi');
    },(err:any)=>{
      this.getError(err.message|| 'kartvizit güncellenirken bir sorun oluştu');
    });
  }

  deleteCard(): void{
    this.showSpinner=true;
    this.cardService.deleteCard(this.data.id)
    .subscribe((res:any)=>{
      this.getSuccsess(res || 'Kartvizit başarıyla silindi.');
  },(err:any)=>{
    this.getError(err.message||'kartvizit silinirken bir sorun oluştu.');
  });
  }

  getSuccsess(message:string): void{
  this.snackbarService.createSnackbar(message);
  this.cardService.getCards();
  this.showSpinner=false;
  this.dialogREF.close();
  }

  getError(message:string): void{
    this.snackbarService.createSnackbar(message)
  this.showSpinner=false;
  }
}
