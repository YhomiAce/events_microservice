import { PrimaryGeneratedColumn } from "typeorm";

export default class BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
}
