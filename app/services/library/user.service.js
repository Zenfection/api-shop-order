import { ObjectId } from 'mongodb';

class UserService {
    constructor(client) {
        this.User = client.db().collection('users')
    }

    async extactUserData(payload) {
        // accept null: phone, address, province, district, ward
        const user = {
            _id: payload._id && ObjectId.createFromHexString(payload._id),
            username: payload.username,
            fullname: payload.fullname,
            email: payload.email,
            password: payload.password,
            active: payload.active ?? true,
            phone: payload.phone ?? null,
            address: payload.address ?? null,
            province: payload.province ?? null,
            district: payload.district ?? null,
            ward: payload.ward ?? null,
        }

        Object.keys(user).forEach(
            (key) => (user[key] === undefined) && delete user[key]
        )
        return user;
    }

    async create(payload) {
        const user = await this.extactUserData(payload)
    
        if (user.messageError) {
            return user
        }

        await this.User.findOneAndUpdate(
            { email: user.email },
            { $set: user },
            { upsert: true, returnOriginal: false }
        )
        return user
    }

    async find(filter) {
        const cursor = await this.User.find(filter);
        return cursor
    }

    async findOne(filter) {
        const cursor = await this.User.findOne(filter);
        return cursor
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.createFromHexString(id)
        }

        // patch update (update only fields that are present in the request)
        const updateDoc = {
            $set: payload,
        }

        const options = {
            projection: { password: 0 },
            returnOriginal: false
        };

        const result = await this.User.findOneAndUpdate(filter, updateDoc, options);
        return result.value
    }

    // async delete(id) {
    //     const result = await this.User.findOneAndDelete({
    //         _id: ObjectId.createFromHexString(id)
    //     })
    //     return result.value
    // }

    // async deleteAll() {
    //     const result = await this.User.deleteMany({})
    //     return result.deletedCount
    // }
}

export default UserService