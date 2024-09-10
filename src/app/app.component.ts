import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import {
  APIResponseModel,
  CartData,
  Customer,
  LoginModel,
} from './model/products';
import { FormsModule } from '@angular/forms';
import { MasterService } from './service/master.service';
import { Constant } from './constant/constant';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    const isUser = localStorage.getItem(Constant.LOCAL_KEY);
    if (isUser != null) {
      const parsObj = JSON.parse(isUser);
      this.loggedUserData = parsObj;
      this.getCartItems();
    }
    this.masterService.onCartAdded.subscribe((res: boolean) => {
      if (res) {
        this.getCartItems();
      }
    });
  }

  getCartItems() {
    this.masterService
      .getcartproductsbyCustId(this.loggedUserData.custId)
      .subscribe((res: APIResponseModel) => {
        this.cartData = res.data;
      });
  }

  title = 'NewEcom';

  cartData: CartData[] = [];

  registerObj: Customer = new Customer();

  loginObj: LoginModel = new LoginModel();

  loggedUserData: Customer = new Customer();

  masterService = inject(MasterService);

  @ViewChild('registerModel') registerModel: ElementRef | undefined;

  @ViewChild('loginModel') loginModel: ElementRef | undefined;
  openRegisterModel() {
    if (this.registerModel) {
      this.registerModel.nativeElement.style.display = 'block';
    }
  }
  closeRegisterModel() {
    if (this.registerModel) {
      this.registerModel.nativeElement.style.display = 'none';
    }
  }

  openLoginModel() {
    if (this.loginModel) {
      this.loginModel.nativeElement.style.display = 'block';
    }
  }
  closeLoginModel() {
    if (this.loginModel) {
      this.loginModel.nativeElement.style.display = 'none';
    }
  }
  onRegister() {
    this.masterService
      .registerNewCustomer(this.registerObj)
      .subscribe((res: APIResponseModel) => {
        if (res.result) {
          alert('Registered successfully');
          this.closeRegisterModel();
        } else {
          alert(res.message);
        }
      });
  }
  onLogin() {
    this.masterService
      .onLogin(this.loginObj)
      .subscribe((res: APIResponseModel) => {
        if (res.result) {
          this.loggedUserData = res.data;
          localStorage.setItem(Constant.LOCAL_KEY, JSON.stringify(res.data));
          this.closeLoginModel();
        } else {
          alert(res.message);
        }
      });
  }

  logoff() {
    localStorage.removeItem(Constant.LOCAL_KEY);
    this.loggedUserData = new Customer();
  }

  isCartOpen: boolean = true;

  showCart() {
    this.isCartOpen = !this.isCartOpen;
  }

  removeProduct(id: number) {
    this.masterService
      .deleteproductbyCartId(id)
      .subscribe((res: APIResponseModel) => {
        if (res.result) {
          alert('Product removed from cart');
          this.getCartItems();
        } else {
          alert(res.message);
        }
      });
  }
}
