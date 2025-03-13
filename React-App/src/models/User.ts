import { ExamType } from "./Exam"
import { RoleType } from "./Role"

export type UserType = {
id: number,
TZ:string,
firstName: string,
lastName: string,
email: string,
passwordHash: string,
password: string,
address: string,
phoneNumber: string
exams:ExamType[],
roles:RoleType[]

}