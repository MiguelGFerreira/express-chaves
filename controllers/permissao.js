import sql from 'mssql';

export const getPermissao = (req, res) => {

	let query = `
	SELECT ARMARIO, NUMERO, DESCRIÇÃO, RIGHT(replicate('0',6) + CAST(SR.MATRICULA AS VARCHAR),6) MATRICULA, TRIM(SR.NOME) NOME
	FROM RKF_CHAVES C
	INNER JOIN RKF_CHAVES_AUTORIZADOS A ON C.ARMARIO + C.NUMERO = A.ID_CHAVE
	INNER JOIN FOLHA12..SENIOR_COLABORADOR SR ON RIGHT(replicate('0',6) + CAST(SR.MATRICULA AS VARCHAR),6) = A.MATRICULA
	ORDER BY ARMARIO, NUMERO
	`

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});
}

export const getFuncionarios = (req, res) => {
	let query = `
		SELECT RIGHT(replicate('0',6) + CAST(MATRICULA AS VARCHAR),6) matricula,
			TRIM(NOME) nome 
		FROM FOLHA12..SENIOR_COLABORADOR
		WHERE DATA_DEMISSAO = ''
		ORDER BY NOME
		`

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});
}

export const deletePermissao = (req, res) => {
	let query = `
		DELETE FROM RKF_CHAVES_AUTORIZADOS WHERE MATRICULA = '${req.params.matricula}' AND ID_CHAVE = '${req.params.idchave}'
	`

	new sql.Request().query(query, (err, result) => {
		if (err) {
			console.error("Error executing query:", err);
		} else {
			res.send(result.recordset); // Send query result as response
		}
	});
}

export const postPermissao = (req, res) => {
	let query = `
	INSERT INTO RKF_CHAVES_AUTORIZADOS (MATRICULA, ID_CHAVE) VALUES ('${req.body.matricula}','${req.body.idchave}')
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
