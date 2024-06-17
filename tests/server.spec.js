const request = require("supertest");
const server = require("../index");

// Definir la función sumar antes de las pruebas
const sumar = (a, b) => Number(a) + Number(b);

describe("Operaciones CRUD de cafes", () => {

    it("Obteniendo un 200", async () => {
        const response = await request(server).get("/cafes").send();
        expect(response.statusCode).toBe(200);
    });

    it("Comprobando el resultado de una sumatoria", () => {
        const n1 = 4;
        const n2 = 5;
        const resultado = sumar(n1, n2);
        expect(resultado).toBe(9);
    });

    it("Obteniendo un cafe", async () => {
        const response = await request(server).get("/cafes/1").send();
        const cafe = response.body;
        expect(response.statusCode).toBe(200);
        expect(cafe).toBeInstanceOf(Object);
        expect(cafe).toHaveProperty('id', 1);
        expect(cafe).toHaveProperty('nombre', expect.any(String));
    });


    it("Enviando un nuevo cafe", async () => {
        const id = Math.floor(Math.random() * 999);
        const cafe = { id, nombre: "Nuevo cafe" };
        const response = await request(server)
            .post("/cafes")
            .send(cafe);
        const cafes = response.body;
        expect(response.statusCode).toBe(201); // Suponiendo que devuelve 201 para creación
        expect(cafes).toContainEqual(cafe);
    });
    it("Obteniendo un 404 al intentar eliminar un café con un id que no existe", async () => {
        const noExisteId = 9999;
        const response = await request(server).delete(`/cafes/${noExisteId}`).set('Authorization', 'Bearer token').send();
        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe("No se encontró ningún café con ese id");
    });
    it("La ruta PUT /cafes devuelve un status code 400 si se intenta actualizar un café con un id diferente al del payload", async () => {
        const cafeExistente = { id: 1, nombre: "Café existente" };
        const response = await request(server)
            .put(`/cafes/${cafeExistente.id}`)
            .send({ id: 2, nombre: "Nuevo nombre del café" });
    
        expect(response.statusCode).toBe(400);
    });
});
