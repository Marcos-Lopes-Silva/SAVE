import { createSearchHash, hashToken } from "@/lib/crypto";
import Group, { IUsers } from "../../models/groupModel";

const BCRYPT_HASH_REGEX = /^\$2[aby]\$\d{2}\$/;

export function isCpfHashed(cpf?: string | null) {
    return !!cpf && BCRYPT_HASH_REGEX.test(cpf);
}

const findExistingCpfHash = async (cpf_search: string) => {
    try {
        const group = await Group.findOne(
            { "members.cpf_search": cpf_search },
            { "members.$": 1 }
        );

        if (!group || !group.members.length) return null;

        return group.members[0].cpf;
    } catch (error) {
        console.error(error);
        return null;
    }
};

// Hashes the CPF of any member whose cpf is still plain text (new or imported
// members), reusing the hash already stored for that CPF in another group so
// the same person always maps to the same cpf hash. Members that already
// carry a bcrypt hash (untouched existing members) are left as-is.
export async function hashNewMembersCpf(members: IUsers[]): Promise<IUsers[]> {
    return Promise.all(
        members.map(async (member) => {
            if (isCpfHashed(member.cpf)) return member;

            const cpf = member.cpf?.replace(/\D/g, "") ?? "";
            const cpf_search = createSearchHash(cpf);
            const existingHash = await findExistingCpfHash(cpf_search);

            return {
                ...member,
                cpf: existingHash ?? (await hashToken(cpf)),
                cpf_search,
            };
        })
    );
}
