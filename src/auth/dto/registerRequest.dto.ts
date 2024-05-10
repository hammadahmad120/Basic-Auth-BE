import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class registerRequest {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message: 'Password must contain 1 letter, 1 number and 1 special character',
  })
  password: string;

  @IsNotEmpty()
  name: string;
}
