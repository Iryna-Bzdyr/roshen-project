import { Component, OnInit, ViewChild } from '@angular/core';
import { IRequests } from 'src/app/shared/interfaces/requests';
import { RequestService } from 'src/app/shared/services/request.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-admin-requests',
  templateUrl: './admin-requests.component.html',
  styleUrls: ['./admin-requests.component.scss']
})
export class AdminRequestsComponent implements OnInit {
  adminRequests: Array<IRequests> = []





//For table 
displayedColumns: string[] = [ 'requestDescription', 'userName', 'userPhone', 'userEmail',  'reguestDate',  'delete'];
dataSource: MatTableDataSource<IRequests>;

  constructor( private requestService: RequestService) { }

  ngOnInit() {
   this.getRequests() 
  }
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort; 



  private getRequests():void{
    this.requestService.getJSONRequests().subscribe(
      data => {
        this.adminRequests = data
        this.dataSource = new MatTableDataSource(this.adminRequests);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
      },
      err => {
        console.log(err)
      }
    )
  }

//Delete request------------------------------------------------------------------------

deleteCategory(request: IRequests): void {
  this.requestService.deleteJSONReguest(request.requestID).subscribe(
    () => {
      this.getRequests();
    }
  );
}


//------------------------------------------------------------
applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
} 

}
