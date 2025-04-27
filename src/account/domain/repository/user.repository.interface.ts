import { User } from "../entities/user";

export interface IUserRepository {
    /**
     * @param id - The ID of the user to find
     * 
     * @returns The user with the given ID, or null if not found
     */
    findById(id: string): Promise<User | null>;

    /**
     * @param email - The email of the user to find 
     * 
     * @returns The user with the given email, or null if not found
     */
    findByEmail(email: string): Promise<User | null>;

    /**
     * @param username - The username of the user to find 
     * 
     * @returns The user with the given username, or null if not found
     */
    findByUsername(username: string): Promise<User | null>;

    /**
     * @param user - The user to create
     * 
     * @returns The created user
     */
    create(user: User): Promise<User>;

    /**
     * @param id - identifier of the user to update
     * @param user - The user to update
     * 
     * @returns The updated user
     */
    update(id: string, user: User): Promise<User | null>;

    /**
     * @param id - identifier of the user to update
     * @param user - The user to update
     * 
     * @returns The updated user
     */
    delete(id: string): Promise<void>;
}   