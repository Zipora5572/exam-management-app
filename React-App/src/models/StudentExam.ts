import { UserType } from "./User"

export type StudentExamType = {
    id: number,
    student:UserType
    teacherId: number | null,
    examId: number | null
    isChecked: boolean,
    grade: number
    teacherComments: string | null,
    checkedAt: Date | null,
}

