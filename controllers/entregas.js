import sql from 'mssql';

export const getEntregas = (req, res) => {
	const { dateStart, dateEnd, chave } = req.query;

	let query = `
	SELECT C.ID
		,C.DATA_ENTREGA
		,C.DATA_DEVOLUCAO
		,C.ID_CHAVE + ' - ' + CHAVE.DESCRIÇÃO ID_CHAVE
		,C.MATRICULA + ' - ' + SR.NOME FUNCIONARIO
		,P.PORTEIRO
	FROM RKF_CHAVES_CONTROLE C
	LEFT JOIN FOLHA12..SENIOR_COLABORADOR SR ON RIGHT(replicate('0',6) + CAST(SR.MATRICULA AS VARCHAR),6) = C.MATRICULA
	LEFT JOIN RKF_CHAVES_PORTEIRO P ON (ID_PORTEIRO = P.ID)
	LEFT JOIN RKF_CHAVES CHAVE ON (LEFT(ID_CHAVE,2) = CHAVE.ARMARIO AND RIGHT(ID_CHAVE,3) = NUMERO)
	WHERE NOT DATA_DEVOLUCAO IS NULL 
	`

	if (dateStart) {
		query += ` AND CAST(DATA_ENTREGA AS DATE) >= '${dateStart}'`;
	}

	if (dateEnd) {
		query += ` AND CAST(DATA_ENTREGA AS DATE) <= '${dateEnd}'`;
	}

	if (chave) {
		query += ` AND C.ID_CHAVE = '${chave}'`;
	}

	query += ` ORDER BY DATA_ENTREGA DESC`

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});

}

export const getEntregasAbertas = (req, res) => {
	const { dateStart, dateEnd, key } = req.query;

	let query = `
	SELECT C.ID
		,C.DATA_ENTREGA
		,C.DATA_DEVOLUCAO
		,C.ID_CHAVE + ' - ' + CHAVE.DESCRIÇÃO ID_CHAVE
		,C.MATRICULA + ' - ' + SR.NOME FUNCIONARIO
		,P.PORTEIRO
	FROM RKF_CHAVES_CONTROLE C
	LEFT JOIN FOLHA12..SENIOR_COLABORADOR SR ON RIGHT(replicate('0',6) + CAST(SR.MATRICULA AS VARCHAR),6) = C.MATRICULA
	LEFT JOIN RKF_CHAVES_PORTEIRO P ON (ID_PORTEIRO = P.ID)
	LEFT JOIN RKF_CHAVES CHAVE ON (LEFT(ID_CHAVE,2) = CHAVE.ARMARIO AND RIGHT(ID_CHAVE,3) = NUMERO)
	WHERE DATA_DEVOLUCAO IS NULL 
	`

	if (dateStart) {
		query += ` AND CAST(DATA_ENTREGA AS DATE) >= '${dateStart}'`;
	}

	if (dateEnd) {
		query += ` AND CAST(DATA_ENTREGA AS DATE) <= '${dateEnd}'`;
	}

	if (key) {
		query += ` AND ID_CHAVE = '${key}'`;
	}

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});

}

export const getEntregaById = (req, res) => {
	const query = `
	SELECT C.ID
		,C.DATA_ENTREGA
		,C.DATA_DEVOLUCAO
		,C.ID_CHAVE
		,C.MATRICULA + ' - ' + TRIM(SR.NOME) FUNCIONARIO
		,P.PORTEIRO
		,C.OBSERVACOES
		,CASE WHEN LEFT(CAST(AF.AFUNC AS VARCHAR(MAX)),4) = 'data' THEN CAST(AF.AFUNC AS VARCHAR(MAX)) ELSE NULL END AS AFUNC_CAST
		,CASE WHEN LEFT(CAST(AP.APORT AS VARCHAR(MAX)),4) = 'data' THEN CAST(AP.APORT AS VARCHAR(MAX)) ELSE NULL END AS APORT_CAST
		,CASE WHEN LEFT(CAST(AFD.AFUNCDEV AS VARCHAR(MAX)),4) = 'data' THEN CAST(AFD.AFUNCDEV AS VARCHAR(MAX)) ELSE NULL END AS AFUNC_DEV_CAST
		,CASE WHEN LEFT(CAST(APD.APORTDEV AS VARCHAR(MAX)),4) = 'data' THEN CAST(APD.APORTDEV AS VARCHAR(MAX)) ELSE NULL END AS APORT_DEV_CAST
	FROM RKF_CHAVES_CONTROLE C
	LEFT JOIN FOLHA12..SENIOR_COLABORADOR SR ON RIGHT(replicate('0',6) + CAST(SR.MATRICULA AS VARCHAR),6) = C.MATRICULA
	LEFT JOIN RKF_CHAVES_PORTEIRO P ON (ID_PORTEIRO = P.ID)
	OUTER APPLY (SELECT ASSINATURA AS AFUNC	FROM RKF_ASSINATURA A WHERE A.ID = ID_ASSINATURA_FUNC) AF
	OUTER APPLY (SELECT ASSINATURA AS APORT	FROM RKF_ASSINATURA A WHERE A.ID = ID_ASSINATURA_PORT) AP
	OUTER APPLY (SELECT ASSINATURA AS AFUNCDEV FROM RKF_ASSINATURA A WHERE A.ID = ID_ASSINATURA_FUNC_DEV) AFD
	OUTER APPLY (SELECT ASSINATURA AS APORTDEV FROM RKF_ASSINATURA A WHERE A.ID = ID_ASSINATURA_PORT_DEV) APD
	WHERE C.ID = ${req.params.idEntrega}
	`

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});
}

export const getEntregaByIdAFunc = (req, res) => {
	const query = `
	SELECT AF.AFUNC
	FROM RKF_CHAVES_CONTROLE C
	OUTER APPLY(SELECT ASSINATURA AS AFUNC FROM RKF_ASSINATURA A WHERE A.ID = ID_ASSINATURA_FUNC) AF
	WHERE C.ID = ${req.params.idEntrega}
	`


	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {

			res.contentType('image/png');
			const imageBuffer = result.recordset[0].AFUNC;
			res.send(imageBuffer); // Send query result as response

		}
	});
}

export const getEntregaByIdAPort = (req, res) => {
	const query = `
	SELECT AP.APORT
	FROM RKF_CHAVES_CONTROLE C
	OUTER APPLY(SELECT ASSINATURA AS APORT FROM RKF_ASSINATURA A WHERE A.ID = ID_ASSINATURA_PORT) AP
	WHERE C.ID = ${req.params.idEntrega}
	`

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.contentType('image/png');
			const imageBuffer = result.recordset[0].APORT;
			res.send(imageBuffer); // Send query result as response
		}
	});
}

export const getEntregaByIdAFuncDev = (req, res) => {
	const query = `
	SELECT AF.AFUNC_DEV
	FROM RKF_CHAVES_CONTROLE C
	OUTER APPLY(SELECT ASSINATURA AS AFUNC_DEV FROM RKF_ASSINATURA A WHERE A.ID = ID_ASSINATURA_FUNC_DEV) AF
	WHERE C.ID = ${req.params.idEntrega}
	`

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {

			res.contentType('image/png');
			const imageBuffer = result.recordset[0].AFUNC_DEV;
			res.send(imageBuffer); // Send query result as response

		}
	});
}

export const getEntregaByIdAPortDev = (req, res) => {
	const query = `
	SELECT AP.APORT_DEV
	FROM RKF_CHAVES_CONTROLE C
	OUTER APPLY(SELECT ASSINATURA AS APORT_DEV FROM RKF_ASSINATURA A WHERE A.ID = ID_ASSINATURA_PORT_DEV) AP
	WHERE C.ID = ${req.params.idEntrega}
	`

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.contentType('image/png');
			const imageBuffer = result.recordset[0].APORT_DEV;
			res.send(imageBuffer); // Send query result as response
		}
	});
}

export const postEntrega = (req, res) => {
	const query = `
	DECLARE @id1 INT, @id2 INT;

	-- Insere assinatura do funcionario e captura o ID
	INSERT INTO RKF_ASSINATURA (ASSINATURA) 
	VALUES (CAST('${req.body.assinatura_funcionario}' AS VARBINARY(MAX)));
	SET @id1 = SCOPE_IDENTITY();

	-- Insere a assinatura do porteiro e captura o ID
	INSERT INTO RKF_ASSINATURA (ASSINATURA) 
	VALUES (CAST('${req.body.assinatura_porteiro}' AS VARBINARY(MAX)));
	SET @id2 = SCOPE_IDENTITY();


	INSERT INTO RKF_CHAVES_CONTROLE 
	(
		ID_CHAVE, 
		MATRICULA, 
		DATA_ENTREGA, 
		OBSERVACOES, 
		ID_ASSINATURA_FUNC, 
		ID_ASSINATURA_PORT, 
		ID_PORTEIRO
	) 
	VALUES
	(
		'${req.body.id_chave}',
		'${req.body.matricula}',
		GETDATE(),
		'${req.body.observacao}',
		@id1,             -- ID do primeiro insert
		@id2,             -- ID do segundo insert
		'${req.body.id_porteiro}'
	);
	`

	//console.log(query);
	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});
}

export const devolveEntrega = (req, res) => {
	// update usando patch para devolver a chave
	const query = `
	DECLARE @id1 INT, @id2 INT;

	-- Insere assinatura do funcionario e captura o ID
	INSERT INTO RKF_ASSINATURA (ASSINATURA) 
	VALUES (CAST('${req.body.assinatura_funcionario}' AS VARBINARY(MAX)));
	SET @id1 = SCOPE_IDENTITY();

	-- Insere a assinatura do porteiro e captura o ID
	INSERT INTO RKF_ASSINATURA (ASSINATURA) 
	VALUES (CAST('${req.body.assinatura_porteiro}' AS VARBINARY(MAX)));
	SET @id2 = SCOPE_IDENTITY();

	UPDATE RKF_CHAVES_CONTROLE SET
		DATA_DEVOLUCAO = GETDATE()
		,ID_ASSINATURA_FUNC_DEV = @id1
		,ID_ASSINATURA_PORT_DEV = @id2
	WHERE ID = ${req.params.idEntrega}
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