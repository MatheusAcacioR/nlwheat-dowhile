import pcl from '../prisma'

class ProfileUserService {
    async execute(user_id: string) {
        const user = await pcl.user.findFirst({
            where: {
                id: user_id,
            },
        })

        return user
    }

}

export { ProfileUserService }