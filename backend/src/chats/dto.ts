import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, ValidateIf, IsString, IsUUID, Max, MaxLength, Min, MinLength } from 'class-validator';

const trim = ({ value }: { value: unknown }) => typeof value === 'string' ? value.trim() : value;

export class CreateChatDto {
  @ValidateIf((_object, value) => value !== undefined) @IsString() @Transform(trim) @MinLength(1) @MaxLength(120)
  title?: string;

  @ValidateIf((_object, value) => value !== undefined) @IsIn(['en', 'es', 'fr', 'pt'])
  language: string = 'en';

  @ValidateIf((_object, value) => value !== undefined) @IsString() @Transform(trim) @MinLength(1) @MaxLength(60)
  courseId: string = 'general';

  @ValidateIf((_object, value) => value !== undefined) @IsIn(['kids', 'teens', 'adults', 'adult', 'business', 'researchers', '50plus', 'general'])
  audience: string = 'general';
}

export class SendMessageDto {
  @IsString() @Transform(trim) @MinLength(1) @MaxLength(4000)
  content!: string;

  @IsUUID('4')
  requestId!: string;

  @ValidateIf((_object, value) => value !== undefined) @IsIn([true, false])
  translate?: boolean = false;
}

export class UpdateChatDto {
  @IsString() @Transform(trim) @MinLength(1) @MaxLength(120)
  title!: string;
}

export class CleanTranscriptDto {
  @IsString() @Transform(trim) @MinLength(1) @MaxLength(4000)
  text!: string;

  @ValidateIf((_object, value) => value !== undefined) @IsIn(['pt', 'en', 'es', 'fr'])
  defaultLanguage: string = 'pt';
}

export class PageDto {
  @ValidateIf((_object, value) => value !== undefined) @Type(() => Number) @IsInt() @Min(1) @Max(100)
  limit: number = 30;

  @ValidateIf((_object, value) => value !== undefined) @Type(() => Number) @IsInt() @Min(0) @Max(1000000)
  offset: number = 0;
}
