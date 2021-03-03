import validator from "https://jspm.dev/class-validator@0.8.5";

const { Length, Contains, IsInt, Min, Max, IsEmail } = validator;

export class PostModel {
  @Length(10, 20)
  title?: string;

  @Contains("hello")
  text?: string;

  @IsInt()
  @Min(0)
  @Max(10)
  rating?: number;

  @IsEmail()
  email?: string;
}
