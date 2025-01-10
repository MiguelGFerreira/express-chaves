import sql from 'mssql';

export const getArmarios = (req, res) => {
	let query = 'SELECT ID, Numero, Genero, Nome, STATUS, Empresa FROM RKF_ARMARIOS';

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});
}

export const getArmariosOcupados = (req, res) => {
	let query = `
	SELECT ID
		,Numero + ' - ' + Nome Armario
	FROM RKF_ARMARIOS
	WHERE STATUS = 1
	ORDER BY Nome
	`;

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});
}

export const getArmariosDet = (req, res) => {
	let query = `
		SELECT A.ID, A.Numero, A.Genero, A.DataEntrega, A.Nome, A.Matricula, A.Setor, A.Funcao, A.SuperiorImediato, A.DataDevolucao, A.STATUS, A.Empresa
		FROM RKF_ARMARIOS A
		`;

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});
}

export const getMovimentacoes = (req, res) => {

	let query = `
	SELECT M.ID
		,A.Numero
		,A.Genero
		,A.Empresa
		,M.Matricula
		,TRIM(SRA.RA_NOME) Nome
		,DataMovimentacao
		,TipoMovimentacao
	FROM RKF_ARMARIOS_MOVIMENTACOES M
	INNER JOIN RKF_ARMARIOS A ON M.IDArmario = A.ID
	LEFT JOIN FOLHA12..SENIOR_COLABORADOR SR ON RIGHT(replicate('0',6) + CAST(SR.MATRICULA AS VARCHAR),6) = M.Matricula
	ORDER BY ID DESC
	`

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});

}

export const getAssinaturaMovimentacao = (req, res) => {

	let query = `
	SELECT ASS.ASSINATURA
	FROM RKF_ARMARIOS_MOVIMENTACOES M
	OUTER APPLY(SELECT ASSINATURA FROM RKF_ASSINATURA A WHERE A.ID = M.IDAssinatura) ASS
	WHERE M.ID = ${req.params.idMov}
	`

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.contentType('image/png');
			const imageBuffer = result.recordset[0].ASSINATURA;
			res.send(imageBuffer); // Send query result as response
		}
	});

}

export const patchArmario = (req, res) => {
	const { dataEntrega, dataDevolucao, nome, matricula, setor, funcao, superior, status } = req.body;
	let dataField = '';
	let insertMovimentacao = '';

	if (dataEntrega) {
		dataField = `DataEntrega = '${dataEntrega}'`
		insertMovimentacao = `INSERT INTO RKF_ARMARIOS_MOVIMENTACOES (IDArmario, Matricula, DataMovimentacao, TipoMovimentacao) VALUES (${req.params.id}, '${matricula}', '${dataEntrega}', 'Empréstimo')`
	}
	if (dataDevolucao) {
		dataField = `DataDevolucao = '${dataDevolucao}'`
		insertMovimentacao = `INSERT INTO RKF_ARMARIOS_MOVIMENTACOES (IDArmario, Matricula, DataMovimentacao, TipoMovimentacao) VALUES (${req.params.id}, '${matricula}', '${dataDevolucao}', 'Devolução')`
	}

	let query = `
		UPDATE RKF_ARMARIOS SET
		${dataField},
		Nome = '${nome}',
		Matricula = '${matricula}',
		Setor = '${setor}',
		Funcao = '${funcao}',
		SuperiorImediato = '${superior}',
		STATUS = '${status}'
		WHERE ID = ${req.params.id};

		${insertMovimentacao}
	`

	console.log(query);

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});
}

export const getAssinaturaArmario = (req, res) => {

	let query = `
	SELECT A.ASSINATURA
	FROM RKF_ARMARIOS_MOVIMENTACOES AM
	INNER JOIN RKF_ASSINATURA A ON AM.IDAssinatura = A.ID
	WHERE TipoMovimentacao = 'Empréstimo'
		AND IDArmario = ${req.params.idArmario}
		AND Matricula = ${req.params.matricula}
	`

	//query = 'SELECT TOP 1 ASSINATURA FROM RKF_ASSINATURA ORDER BY ID DESC'
	//console.log(query);

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.contentType('image/png');
			const imageBuffer = result.recordset[0].ASSINATURA;
			res.send(imageBuffer); // Send query result as response
		}
	});

}

export const getEmprestimosSemAssinatura = (req, res) => {

	let query = `
	SELECT A.Numero + ' - ' + SR.NOME Armario
		,AM.ID
	FROM RKF_ARMARIOS_MOVIMENTACOES AM
	LEFT JOIN RKF_ARMARIOS A ON AM.IDArmario = A.ID
	LEFT JOIN FOLHA12..SENIOR_COLABORADOR SR ON RIGHT(replicate('0',6) + CAST(SR.MATRICULA AS VARCHAR),6) = A.Matricula
	WHERE IDAssinatura IS NULL
		AND AM.TipoMovimentacao = 'Empréstimo'
		AND SR.NOME IS NOT NULL
	ORDER BY SR.NOME
	`

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});

}

export const patchMovimentacaoArmario = (req, res) => {

	let query = `
	DECLARE @id1 INT;

	-- Insere assinatura do funcionario e captura o ID
	INSERT INTO RKF_ASSINATURA (ASSINATURA) 
	VALUES (CAST('${req.body.assinatura_funcionario}' AS VARBINARY(MAX)));
	SET @id1 = SCOPE_IDENTITY();

	UPDATE RKF_ARMARIOS_MOVIMENTACOES SET IDAssinatura = @id1 WHERE ID = ${req.params.idMovimentacao}
	`

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});
}

export const postMovimentacaoSegundaVia = (req, res) => {

	let query = `
	DECLARE @id1 INT, @id2 INT;
	DECLARE @matricula VARCHAR(6) = (SELECT Matricula FROM RKF_ARMARIOS WHERE ID = ${req.body.id_armario})

	UPDATE RKF_ARMARIOS SET SegundaViaEmprestada = ${req.body.tipo_movimentacao} WHERE ID = ${req.body.id_armario}

	-- Insere assinatura do funcionario e captura o ID
	INSERT INTO RKF_ASSINATURA (ASSINATURA) 
	VALUES (CAST('${req.body.assinatura_funcionario}' AS VARBINARY(MAX)));
	SET @id1 = SCOPE_IDENTITY();

	-- Insere a assinatura do porteiro e captura o ID
	INSERT INTO RKF_ASSINATURA (ASSINATURA) 
	VALUES (CAST('${req.body.assinatura_porteiro}' AS VARBINARY(MAX)));
	SET @id2 = SCOPE_IDENTITY();

	INSERT INTO RKF_ARMARIOS_MOVIMENTACOES (
		IDArmario
		,Matricula
		,DataMovimentacao
		,TipoMovimentacao
		,IDAssinatura
		,IDAssinaturaPorteiro
		)
	VALUES (
		${req.body.id_armario}
		,@matricula
		,CAST(GETDATE() AS DATE)
		,'SEGUNDA VIA'
		,@id1
		,@id2
		)
	`

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});
}

export const getSegundaViaEmAberto = (req, res) => {

	let query = "SELECT ID, Numero, Nome FROM RKF_ARMARIOS WHERE SegundaViaEmprestada = 1"

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});

}

export const getRelatorioSegundaViaEmAberto = (req, res) => {

	let query = `
	SELECT ARM.Numero
		,ARM.Nome
		,ARM.Empresa
		,MAX(MOV.DataMovimentacao) DataMovimentacao
		,DATEDIFF(DAY,MOV.DataMovimentacao,GETDATE()) Dias
	FROM RKF_ARMARIOS_MOVIMENTACOES MOV
	INNER JOIN RKF_ARMARIOS ARM ON ARM.ID = MOV.IDArmario
		AND MOV.TipoMovimentacao = 'SEGUNDA VIA'
	WHERE SegundaViaEmprestada = 1
	GROUP BY ARM.Numero, ARM.Nome, ARM.Empresa, MOV.DataMovimentacao
	ORDER BY Dias
	`

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});

}
