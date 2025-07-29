import { Entity, Column } from 'typeorm';

@Entity('love_ys_code')
export class Code {
  @Column({ primary: true, length: 20, name: 'code_unit' })
  codeUnit: string;

  @Column({ primary: true, length: 20, name: 'code_id' })
  codeId: string;

  @Column({ length: 100, name: 'code_name' })
  codeName: string;
}