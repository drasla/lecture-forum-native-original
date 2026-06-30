import { z } from "zod";

export const postSchema = z
    .object({
        categoryId: z.number().positive("카테고리 정보가 올바르지 않습니다."),
        title: z
            .string()
            .min(1, "제목을 입력해주세요.")
            .max(255, "제목은 255자를 넘을 수 없습니다."),
        content: z.string().min(1, "내용을 입력해주세요."),
        option1Text: z.string().max(50, "50자 이하로 입력해주세요.").optional().or(z.literal("")),
        option2Text: z.string().max(50, "50자 이하로 입력해주세요.").optional().or(z.literal("")),
    })
    // refine 은 검증 함수를 단순화 하여 true나 false로 검증 + 오류 메세지를 한 곳에만 출력할 때 사용
    // superRefine 은 검증 함수가 복잡해져야 할 때 사용
    .superRefine((data, ctx) => {
        const isOption1Filled = !!data.option1Text?.trim();
        const isOption2Filled = !!data.option2Text?.trim();

        if (isOption1Filled !== isOption2Filled) {
            ctx.addIssue({
                code: "custom",
                message: "투표를 설정하려면 두 선택지를 모두 입력해주세요.",
                path: ["option1Text"],
            });
        }
    });

export type PostInputType = z.infer<typeof postSchema>;
