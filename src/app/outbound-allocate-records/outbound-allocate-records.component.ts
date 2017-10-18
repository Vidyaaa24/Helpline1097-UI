import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ElementRef, Renderer } from '@angular/core';
import { enableProdMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { OutboundCallAllocationService } from '../services/outboundServices/outbound-call-allocation.service';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';
import { OutboundSearchRecordService } from '../services/outboundServices/outbound-search-records.service';

@Component({
  selector: 'app-outbound-allocate-records',
  templateUrl: './outbound-allocate-records.component.html',
  styleUrls: ['./outbound-allocate-records.component.css'],
})

export class OutboundAllocateRecordsComponent implements OnInit {
  public showCreateFlag = false;
  serviceProviders: string[];
  data: any;
  totalNewRecords: any;
  totalRecords: any;
  AllocateNoOfRecords: any;
  users: any = [];
  userID: any;
  roleID: any;
  savedRes: any;
  allocateNo: any;
  roles: any = [];
  providerServiceMapID: number;
  @Input() outboundCallRequests: any = [];
  allocateForm: FormGroup;
  // @ViewChild('allocateForm') allocateForm: NgForm;
  @Output() outboundCount: EventEmitter<any> = new EventEmitter<any>();
  initialCount: number;
  @ViewChild('allocateRef') input: ElementRef;


  constructor(
    private _OCAService: OutboundCallAllocationService,
    private saved_data: dataService,
    private alertMessage: ConfirmationDialogsService,
    private fb: FormBuilder,
    private _OSRService: OutboundSearchRecordService,
    private renderer: Renderer
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.providerServiceMapID = this.saved_data.current_service.serviceID;
    // this.roles = this.saved_data.userPriveliges[0].roles;
    this.getRoles();
    // this.initialCount = this.outboundCallRequests.length;
    // this.outboundCallRequests = this.outboundCallRequests;
    //  this.getOutboundCall(this.providerServiceMapID);
  }
  getOutboundCall(serviceProviderMapID) {
    this._OSRService.getUnallocatedCalls(serviceProviderMapID)
      .subscribe(resProviderData => {
        this.initialCount = resProviderData.data.length;
        this.allocateForm.controls['outboundCallRequests'].setValue(resProviderData.data);
      });
  }
  createForm() {
    this.allocateForm = this.fb.group({
      roleID: ['', Validators.required],
      userID: ['', Validators.required], // <--- the FormControl called "name"
      allocateNo: ['', Validators.required],
      outboundCallRequests: [null]
    });
  }
  getRoles() {
    this._OCAService.getRolesbyProviderID(this.providerServiceMapID)
      .subscribe(resProviderData => {
        this.roles = resProviderData.filter(function (item) {
          return item.RoleName.toLowerCase() !== 'supervisor' && item.RoleName.toLowerCase() !== 'provideradmin';
        })
        console.log('roles: ', this.roles);
      }
      );
  }
  getAgents(roleID: any) {
    this._OCAService.getAgentsbyRoleID(this.providerServiceMapID, roleID)
      .subscribe(resProviderData => {
        console.log('reading...')
        this.users = resProviderData;
        console.log('users: ', this.users);
      }
      );

  }

  ngOnChanges() {
    //  this.initialCount = this.outboundCallRequests.length;
    this.allocateForm.controls['outboundCallRequests'].setValue(this.outboundCallRequests);
    // this.outboundCallRequests = this.outboundCallRequests;
    this.allocateForm.patchValue({
      userID: []
    });
  }

  onCreate(val: any) {
    this._OCAService.allocateCallsToAgenta(this.allocateForm.value)
      .subscribe(
      (response) => {
        this.alertMessage.alert('Successfully Allocated');
        this.outboundCount.emit(this.providerServiceMapID);
        this.getOutboundCall(this.providerServiceMapID);
      },
      (error) => {
        this.alertMessage.alert(error.errorMessage);
      }
      );
  }

  OnSelectChange() {
    let outboundlistCount = this.allocateForm.get('outboundCallRequests').value;
    let tempValue = Math.floor(outboundlistCount.length / this.allocateForm.value.userID.length);
    this.initialCount = tempValue;
    this.allocateForm.patchValue({
      allocateNo: tempValue
    });

  }

}


