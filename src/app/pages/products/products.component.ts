import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MasterService } from '../../service/master.service';
import {
  APIResponseModel,
  CartModel,
  Category,
  Customer,
  ProductList,
} from '../../model/products';
import { map, Observable, Subscription } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Constant } from '../../constant/constant';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit, OnDestroy {
  // productList: ProductList[] = [];

  productList = signal<ProductList[]>([]);

  categoryList: Observable<Category[]> = new Observable<Category[]>();
  subscriptionList: Subscription[] = [];

  masterService = inject(MasterService);
  // loggedUserData: Customer = new Customer();

  constructor() {
    // this.loggedUserData = this.masterService.loggedUserData;
  }
  ngOnInit(): void {
    this.loadAllProducts();
    this.categoryList = this.masterService
      .getAllCategory()
      .pipe(map((item) => item.data));
  }

  loadAllProducts() {
    this.subscriptionList.push(
      this.masterService.getAllProducts().subscribe((res: APIResponseModel) => {
        // this.productList = res.data;
        this.productList.set(res.data);
      })
    );
  }
  ngOnDestroy(): void {
    this.subscriptionList.forEach((element) => {
      element.unsubscribe();
    });
  }
  getProductsByCategoryId(id: number) {
    this.masterService
      .getAllProductsByCategoryId(id)
      .subscribe((res: APIResponseModel) => {
        this.productList.set(res.data);
      });
  }

  addtoCart(id: number) {
    const newObj: CartModel = new CartModel();
    newObj.ProductId = id;
    // newObj.CustId = this.loggedUserData.custId;
    newObj.CustId = this.masterService.loggedUserData.custId;
    this.masterService.addtocart(newObj).subscribe((res: APIResponseModel) => {
      if (res.result) {
        alert('Added to cart successfully');
        this.masterService.onCartAdded.next(true);
      } else {
        alert(res.message);
      }
    });
  }
}
