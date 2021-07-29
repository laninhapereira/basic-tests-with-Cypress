describe("Tickets", () => {
    //vamos usá-lo para entrar na url do site e realizar os testes
    beforeEach(() => cy.visit("https://ticket-box.s3.eu-central-1.amazonaws.com/index.html"));

    //preencher todos os campos do tipo texto
    //esse () => quer dizer que esse teste vai executar a função que vem após o {
    // .only serve para executar só um teste
    it("fills all the text input fields", () => {
        const firstName = "Laninha";
        const lastName = "Pereira"
        //usado para identificar elementos através de seletores css
        //Aqui estou vendo se o label vai receber Laninha no campo nome 
        cy.get("#first-name").type(firstName);
        cy.get("#last-name").type(lastName);
        cy.get("#email").type("laninha@gmail.com");
        cy.get("#requests").type("Carnivora");
        cy.get("#signature").type(`${firstName} ${lastName}`);
    });

    //teste para ver se o numero de ticket selecionado foi 2
    //.select é usado quando se tem um campo seletor como o do site, onde se seleciona apenas uma opção
    it("select two tickets", () => {
        cy.get("#ticket-quantity").select("2");
    });

    //teste para ver se o ticket type selecionado foi VIP
    //para selecionar radio buttons se utiliza o .check()
    it("select VIP ticket type", () => {
        cy.get("#vip").check();
    });

    //teste para ver se o how you did about é social media
    //para selecionar checkboxes se utiliza o .check() também
    it("select 'how you did about' options", () => {
        cy.get("#social-media").check();
    });

    //vai marcar friend e publication e depois desmarcar friend
    it("selects 'friend', and 'publication', then uncheck 'friend'", () => {
        cy.get("#friend").check();
        cy.get("#publication").check();
        cy.get("#friend").uncheck();
    });

    //teste para ver se o nome na header é TICKETBOX
    //existem vários tipos de verificação, nesse vamos verificar se um determinado elemento html possui determinado texto
    it("has 'TICKETBOX' header´s heading", () => {
        cy.get("header h1").should("contain", "TICKETBOX")
    });


    //Adiciona um email errado para ver se o alert dele tá funcionando
    // ele tem um class que mostra uma mensagem quando tá ok e quando tá errado, então tem que verificar isso
    // é possível criar aliars, um apelido para um elemento para aproveitar ele e não precisa repetir seletores css, usa o .as para isso. para dizer que é um aliars coloca o @

    // nesse caso houve um erro mais como usamos aliars para o invalidEmail ele acaba salvando esse estado e o teste de should not exist falha
    // it.only("alerts on invalid e-mail", () => {
    //     cy.get("#email")
    //         .as("email")
    //         .type("laninha-gmail.com");

    //     //aqui esse email.invalid tá dizendo que eu preciso de uma class inválida
    //     cy.get("#email.invalid")
    //         .as("invalidEmail")
    //         .should("exist");

    //     cy.get("@email")
    //         .clear() //limpa o campo
    //         . type("laninha@gmail.com");

    //     cy.get("@invalidEmail").should("not.exist");
    // })

    it("alerts on invalid e-mail", () => {
        cy.get("#email")
            .as("email")
            .type("laninha-gmail.com");

        //aqui esse email.invalid tá dizendo que eu preciso de uma class inválida
        cy.get("#email.invalid").should("exist");

        cy.get("@email")
            .clear() //limpa o campo
            . type("laninha@gmail.com");

        cy.get("#email.invalid").should("not.exist");
    });

    it("fills and reset the form", () => {
        const firstName = "Laninha";
        const lastName = "Pereira";
        const fullname = `${firstName} ${lastName}`;

        cy.get("#first-name").type(firstName);
        cy.get("#last-name").type(lastName);
        cy.get("#email").type("Laninha@gmail.com");
        cy.get("#ticket-quantity").select("2");
        cy.get("#vip").check();
        cy.get("#friend").check();
        cy.get("#social-media").check();
        cy.get("#requests").type("Uma requisição digitada bem aqui ó");
        cy.get(".agreement p").should(
            "contain", 
            `I, ${fullname}, wish to buy 2 VIP tickets. I understand that all ticket sales are final.`);

        cy.get("#agree").click();
        cy.get("#signature").type(`${firstName} ${lastName}`);

        //como esse botão tem a verificação de sidable para funcionar, teste isso
        cy.get("button[type='submit'")
        .as("submitButton")
        .should("not.be.disabled");

        cy.get("button[type='reset']").click();
        cy.get("@submitButton").should("be.disabled");

    });

    //criamos uma função e chamamos ela, a partir daí todos os dados obrigatórios foram marcados e eu vou desmarcar um deles e ver so botão fica desabilitado
    it("fills mandatory fields using support command", () => {
        const customer = {
            firstName: "John",
            lastName: "Ackerman",
            email: "johnackerman@gmail.com"
        };

        //essa função fica na pasta support e na classe commands
        cy.fillMandatoryFields(customer);

        cy.get("button[type='submit'")
        .as("submitButton")
        .should("not.be.disabled");

        cy.get("#agree").uncheck();
        cy.get("@submitButton").should("be.disabled");
    });
});
