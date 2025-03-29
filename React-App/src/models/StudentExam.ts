import { UserType } from "./User"

export type StudentExamType = {
    id: number,
    student:UserType
    teacherId: number | null,
    examId: number | null,
    examPath: string,
    isChecked: boolean,
    grade: number
    teacherComments: string | null,
    checkedAt: Date | null,
}

