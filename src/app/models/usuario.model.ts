
export class Usuario {
    constructor(
        public nombre: string,
        public email: string,
        public password: string,
        public img?: string, // a partir de un parametro opcional el resto debe ser opcional
        public role?: string,
        public google?: string,
        public _id?: string
    ){}
}