const users = [
          {
                    id: "admin",
                    password: "56789",
                    role: "admin",
                    token: "admin"
          },
          {
                    id: "user1",
                    password: "2244",
                    role: "user",
                    token: "user"
          }
];
export function login(id, password) {
          const User = users.find((User) => User.id === id && User.password === password);
          return User ? {role: User.role, token: User.token} : null;
}