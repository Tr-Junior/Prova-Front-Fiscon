import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Form } from '../models/form.models';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})

export class FormComponent implements OnInit {

  public forms: any[] = [];
  public form: FormGroup;

  displayedColumns: String[] = ['id', 'nome', 'telefone', 'delete'];
  listData!: MatTableDataSource<Form>;
  search!: String;

  matcher = new ErrorStateMatcher();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private fb: FormBuilder) {

    this.form = this.fb.group({
      nome: ['', Validators.compose([
        Validators.minLength(5),
        Validators.maxLength(25),
        Validators.nullValidator,
        Validators.required
      ])],
      telefone: ['', Validators.compose([
        Validators.minLength(11),
        Validators.maxLength(14),
        Validators.required
      ])]
    });
     this.load();

  }


  add() {
    const nome = this.form.controls['nome'].value;
    const telefone = this.form.controls['telefone'].value;

    const id = uuidv4();
    this.forms.push(new Form(id, nome, telefone));
    this.save();
    this.clear();
    this.load();
  }

  save() {
    const data = JSON.stringify(this.forms);
    localStorage.setItem('forms', data);
  }

  clear() {
    this.form.reset();
  }

  load(){
    const data = localStorage.getItem('forms');
    if(data){
      this.forms = JSON.parse(data);
    }else{
      this.forms = [];
    }
    this.listData = new MatTableDataSource(this.forms);
    this.ngAfterViewInit();
  }

  remove(form: Form) {
    const index = this.forms.indexOf(form);
    if (index !== -1) {
      this.forms.splice(index, 1);
    }
    this.save();
    this.load();
  }

  ngAfterViewInit() {
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort

  }

  onSearchClear(){
    this.search = "";
    this.applyFilter();
  }

  applyFilter() {
    this.listData.filter = this.search.trim().toLowerCase();

     if (this.listData.paginator) {
      this.listData.paginator.firstPage();
    }

  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

  ngOnInit(): void {

  }
}


