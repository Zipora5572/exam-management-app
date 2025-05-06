import { TopicType } from "./Topic";
import { UserType } from "./User"

export type ExamType = {
    id: number,
    userId: number |undefined,
    name: string,
    uniqueFileName: string,
    namePrefix: string,
    examType: string,
    folderId: number|null,
    topic:TopicType,
    isShared: boolean,
    isStarred: boolean,
    examPath: string,
    updatedAt:Date,
    createdAt:Date,

}

export type ExamFolderType={
    id: number,
    userId: number,
    name: string,
    namePrefix: string,
    parentFolderId: number|null,
    updatedAt:Date,
    createdAt:Date,
    isShared: boolean,
    isStarred: boolean,
    ofTeacherExams: boolean,
    type:'folder',
}
export type ExamFileType = ExamType & {
    folderId?: number;
    type: 'file';
}

export type StudentExamType = {
   examId: number,
   studentDetails: UserType,
   teacherId: number,
   isChecked: boolean,
   grade: number,
   evaluation: string | null,
    
};
