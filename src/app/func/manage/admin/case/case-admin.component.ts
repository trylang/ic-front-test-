import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras, Params } from '@angular/router';
import { CaseAdminService } from './case-admin.service';
import { Case, QueryParam } from './model';

import swal from 'sweetalert2';
import { flyInOutAnimation } from '../../../../tool/animation';
import { SnackBar } from '../../../../tool/snackbar';

@Component({
  templateUrl: './case-admin.component.html',
  animations: [ flyInOutAnimation ],
  styleUrls: ['./case-admin.component.scss'],
  providers: [CaseAdminService]
})
export class CaseAdminComponent implements OnInit {
  public cases: Case[];
  public totalRecords: number;
  public currentPage: number;
  public queryParam: QueryParam;

  constructor(
    private caseService: CaseAdminService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: SnackBar
  ) {
    this.queryParam = new QueryParam();
  }

  public ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.queryParam.page = params['page'] || 1;
      this.queryParam.key = params['key'] || null;
      this.queryParam.type = Number(params['type']) || null;
      this.queryParam.sort = Number(params['sort']) || 0;
      this.queryParam.stype = params['stype'] || 'key';

      this.currentPage = this.queryParam.page;
      this.listCases();
    });
  }

  public paginate(paginator: any) {
    const page = paginator.page + 1;
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      queryParams: {
        page
      }
    };

    this.router.navigate([], navigationExtras);
  }

  public onChangeSort() {
    const sort = this.queryParam.sort === 0 ? 1 : 0;
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      queryParams: {
        sort
      }
    };

    this.router.navigate([], navigationExtras);
  }

  public onChangeType(type: number) {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      queryParams: {
        page: 1,
        type
      }
    };

    this.router.navigate([], navigationExtras);
  }

public onChangeSearchType(stype: string) {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      queryParams: {
        stype
      }
    };

    this.router.navigate([], navigationExtras);
  }

  public onSearch(key: string) {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      queryParams: {
        page: 1,
        key
      }
    };

    this.router.navigate([], navigationExtras);
  }

  public onDelete(md5: string) {
    swal({
      title: '您确定要删除吗？',
      text: '该操作将彻底删除，并且不能恢复!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0069d9',
      cancelButtonColor: '#868e96',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then(
      () => {
        // swal('Deleted!', 'Your file has been deleted.', 'success');
      this.deleteCase(md5);
      },
      (dismiss: string) => {
        // dismiss can be 'cancel', 'overlay',
        // 'close', and 'timer'
        if (dismiss === 'cancel') {
          // swal('Cancelled', 'Your imaginary file is safe :)', 'error');
          this.snackBar.info('已取消删除');
        }
      }
    );
  }


    /**
     * 管理员好获取案例列表
     *
     * @private
     * @memberof CaseComponent
     */
  private listCases() {
    this.caseService.listCases(this.queryParam).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.cases = data.data;
        this.totalRecords = data.size;
      }
    });
  }

  /**
   * 管理员删除案例
   *
   * @private
   * @param {string} md5
   * @memberof CaseComponent
   */
  private deleteCase(md5: string) {
    this.caseService.deleteCase(md5).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.snackBar.success('删除成功');
        this.listCases();
      }
    });
  }
}

