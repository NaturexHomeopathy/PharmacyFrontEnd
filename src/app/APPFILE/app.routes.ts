import { Routes } from '@angular/router';
import { DashboardComponent } from '../MainComponent/Dashboard/dashboard';
import { LoginComponent } from '../MainComponent/Login/login-component/login-component';
import { SuperadminDashboard } from '../Component/Superadmin/superadmin-dashboard/superadmin-dashboard';
import { authGuard } from '../Guards/auth.guard';
import { roleGuard } from '../Guards/role.guard';
import { UserComponent } from '../Component/Superadmin/user/user';
import { HealthProductComponent } from '../Component/Superadmin/healthproduct/healthproduct';
import { Appointment } from '../Component/Superadmin/appointment/appointment';
import { Orders } from '../Component/Superadmin/orders/orders';
import { Transactions } from '../Component/Superadmin/transactions/transactions';
import { DiseaseComponent } from '../Component/Superadmin/disease/disease';
import { Category } from '../Component/Superadmin/category/category';
import { Medicine } from '../MainComponent/medicine/medicine';
import { RegisterComponent } from '../MainComponent/Register/register/register';
import { VisitorAppointment } from '../MainComponent/VisitorAppointment/visitor-appointment/visitor-appointment';
import { VisitorOrders } from '../MainComponent/VisitorOrders/visitor-orders/visitor-orders';
import { Cart } from '../MainComponent/cart/cart';
import { ForgotPassword } from '../MainComponent/ForgotPassword/forgot-password/forgot-password';

export const routes: Routes = [
  { path: '', component: DashboardComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {path:'medicines', component:Medicine},
  {path:'AppoinmentVisitor', component:VisitorAppointment},
  { path: 'orders', component: VisitorOrders },
  { path:'cart',component:Cart},
  {path:'forgot-password', component:ForgotPassword},
  
  {
    path: 'superadmin',
    component: SuperadminDashboard,
    canActivate: [authGuard, roleGuard(['SUPERADMIN'])],
    children: [
      {path:'',redirectTo:'users',pathMatch:'full'},
      {path: 'users', component: UserComponent },
      {path:'healthproduct', component: HealthProductComponent},
      {path:'category', component:Category},
      {path:'disease', component:DiseaseComponent},
      {path:'appointment',component:Appointment},
      {path:'orders',component:Orders},
      {path:'transactions',component:Transactions}
    ]
  }
];

