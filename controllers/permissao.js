import sql from 'mssql';

export const getPermissao = (req, res) => {

	let query = `
	SELECT ARMARIO, NUMERO, DESCRIÇÃO, TRIM(RA_MAT) MATRICULA, TRIM(RA_NOME) NOME
	FROM RKF_CHAVES C
	INNER JOIN RKF_CHAVES_AUTORIZADOS A ON C.ARMARIO + C.NUMERO = A.ID_CHAVE
	INNER JOIN FOLHA12..SRA010 SRA ON SRA.RA_MAT = A.MATRICULA
		AND SRA.D_E_L_E_T_ = ''
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
		SELECT TRIM(RA_MAT) matricula,
			TRIM(RA_NOME) nome 
		FROM FOLHA12..SRA010
		WHERE RA_DEMISSA = ''
			AND D_E_L_E_T_ = ''
		ORDER BY RA_NOME
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
	console.log(query);
	// new sql.Request().query(query, (err, result) => {
	// 	if (err) {
	// 		console.error("Error executing query:", err);
	// 	} else {
	// 		res.send(result.recordset); // Send query result as response
	// 	}
	// });
}
