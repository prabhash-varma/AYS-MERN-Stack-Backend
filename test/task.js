let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');

// Assertion style
chai.should();

var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJoYXJnYXZrb2R1cmkxMjNAZ21haWwuY29tIiwiaWF0IjoxNjgyNDE4MTU4LCJleHAiOjE2ODI0MjE3NTh9.lCiB5F2-cdupwt9uMx-luQ8h6YGa_2VvAUApD__1vxA"

chai.use(chaiHttp);

describe('Tasks API', () => {

    /**
     * Test the GET route
     */
    describe("GET /getmessagesforadmin", () => {
        it("It should GET all the messages", (done) => {
            chai.request(server)
                .get("/getmessagesforadmin")
                .set({ authorization: `Bearer ${token}` })
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    //response.body.length.should.be.eq(3);
                    done();
                })
        })


        it("It should NOT GET all the tasks", (done) => {
            chai.request(server)
                .get("/getmessageforadmin")
                .set({ authorization: `Bearer ${token}` })
                .end((err, response) => {
                    response.should.have.status(404);
                    done();
                })
        })
    })



    /**
     * Test the GET (by id) route
     */
    describe("GET /getuserbyid/:id", () => {
        it("It should GET a user by ID", (done) => {
            const taskId = "64476faf074c0e20f8464673";
            chai.request(server)
                .get("/getuserbyid/" + taskId)
                .set({ authorization: `Bearer ${token}` })
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                   
                    done();
                })
        })

        it("It should NOT GET a user by ID", (done) => {
            const taskId = "5f8b8b1b9b0b3e1a3c8b4b1b";
            chai.request(server)
                .get("/getuserbyid/" + taskId)
                .set({ authorization: `Bearer ${token}` })
                .end((err, response) => {
                    response.body.should.be.a('object');
                 done();
                })
        })
    })




});