import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {
  constructor(private jwtService: JwtService){

  }
  login(email: string, password: string) {
    // Simulate authentication logic
    if (email === 'admin' && password === 'password') {
      return this.signUser(1, email, "Doctor");
    }
    return 'Invalid credentials!';
  }
  signUser(userId:number, email:string, type: string){
    return this.jwtService.sign({
      sub: userId,
      email,
      claim: type
    })
  }
}
