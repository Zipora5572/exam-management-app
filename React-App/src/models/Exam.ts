import { TopicType } from "./Topic";
import { UserType } from "./User"

export type ExamType = {
    id: number,
    userId: number |undefined,
    examName: string,
    uniqueFileName: string,
    examType: string,
    // topicName: string,
    folderId: number|null,
    topic:TopicType,
    sharing: boolean,
    modified: string,
    examPath: string,
    updatedAt:Date,
}
export type ExamFolderType={
    id: number,
    userId: number,
    folderName: string,
    parentFolderId: number|null,
    modified: string,
    type:'folder',
}
export type ExamFileType = ExamType & {
    parentId?: number;
    type: 'file';
}

export type StudentExamType = {
   examId: number,
   studentDetails: UserType,
   teacherId: number,
   isChecked: boolean,
   score: number,
   teacherComments: string | null,
    
};
