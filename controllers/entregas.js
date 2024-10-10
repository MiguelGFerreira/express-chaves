import sql from 'mssql';

export const getEntregas = (req, res) => {
	const { dateStart, dateEnd, chave } = req.query;

	let query = `
	SELECT C.ID
		,C.DATA_ENTREGA
		,C.DATA_DEVOLUCAO
		,C.ID_CHAVE + ' - ' + CHAVE.DESCRIÇÃO ID_CHAVE
		,SRA.RA_MAT + ' - ' + SRA.RA_NOME FUNCIONARIO
		,P.PORTEIRO
	FROM RKF_CHAVES_CONTROLE C
	LEFT JOIN FOLHA12..SRA010 SRA ON (RA_MAT = MATRICULA AND SRA.D_E_L_E_T_ = '')
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
		,C.ID_CHAVE
		,SRA.RA_MAT + ' - ' + SRA.RA_NOME FUNCIONARIO
		,P.PORTEIRO
	FROM RKF_CHAVES_CONTROLE C
	LEFT JOIN FOLHA12..SRA010 SRA ON (RA_MAT = MATRICULA AND SRA.D_E_L_E_T_ = '')
	LEFT JOIN RKF_CHAVES_PORTEIRO P ON (ID_PORTEIRO = P.ID)
	WHERE DATA_DEVOLUCAO IS NULL 
	`

	if (dateStart) {
		query += ` AND CAST(DATA_ENTREGA AS DATE) >= '${dateStart}'`;
	}

	if (dateEnd) {
		query += ` AND CAST(DATA_ENTREGA AS DATE) <= '${dateEnd}'`;
	}

	if (key) {
		query += `AND ID_CHAVE = '${key}'`;
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
		,TRIM(SRA.RA_MAT) + ' - ' + TRIM(SRA.RA_NOME) FUNCIONARIO
		,P.PORTEIRO
		,C.OBSERVACOES
	FROM RKF_CHAVES_CONTROLE C
	LEFT JOIN FOLHA12..SRA010 SRA ON (RA_MAT = MATRICULA AND SRA.D_E_L_E_T_ = '')
	LEFT JOIN RKF_CHAVES_PORTEIRO P ON (ID_PORTEIRO = P.ID)
	LEFT JOIN RKF_CHAVES CHAVE ON (LEFT(ID_CHAVE,2) = CHAVE.ARMARIO AND RIGHT(ID_CHAVE,3) = NUMERO)
	OUTER APPLY(SELECT ASSINATURA AS AFUNC FROM RKF_ASSINATURA A WHERE A.ID = ID_ASSINATURA_FUNC) AF
	OUTER APPLY(SELECT ASSINATURA AS APORT FROM RKF_ASSINATURA A WHERE A.ID = ID_ASSINATURA_PORT) AP
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
	LEFT JOIN FOLHA12..SRA010 SRA ON (RA_MAT = MATRICULA AND SRA.D_E_L_E_T_ = '')
	LEFT JOIN RKF_CHAVES_PORTEIRO P ON (ID_PORTEIRO = P.ID)
	LEFT JOIN RKF_CHAVES CHAVE ON (LEFT(ID_CHAVE,2) = CHAVE.ARMARIO AND RIGHT(ID_CHAVE,3) = NUMERO)
	OUTER APPLY(SELECT ASSINATURA AS AFUNC FROM RKF_ASSINATURA A WHERE A.ID = ID_ASSINATURA_FUNC) AF
	OUTER APPLY(SELECT ASSINATURA AS APORT FROM RKF_ASSINATURA A WHERE A.ID = ID_ASSINATURA_PORT) AP
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

export const getEntregaByIdAPort = (req, res) => {
	const query = `
	SELECT AP.APORT
	FROM RKF_CHAVES_CONTROLE C
	LEFT JOIN FOLHA12..SRA010 SRA ON (RA_MAT = MATRICULA AND SRA.D_E_L_E_T_ = '')
	LEFT JOIN RKF_CHAVES_PORTEIRO P ON (ID_PORTEIRO = P.ID)
	LEFT JOIN RKF_CHAVES CHAVE ON (LEFT(ID_CHAVE,2) = CHAVE.ARMARIO AND RIGHT(ID_CHAVE,3) = NUMERO)
	OUTER APPLY(SELECT ASSINATURA AS AFUNC FROM RKF_ASSINATURA A WHERE A.ID = ID_ASSINATURA_FUNC) AF
	OUTER APPLY(SELECT ASSINATURA AS APORT FROM RKF_ASSINATURA A WHERE A.ID = ID_ASSINATURA_PORT) AP
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
