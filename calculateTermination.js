function calcularRescisao() {
    const salario = parseFloat(document.getElementById('pay').value);
    const dataInicio = document.getElementById('startDate').value;
    const dataFim = document.getElementById('endDate').value;
    const feriasRecebidas = document.getElementById('vacation').value;
    const decimoTerceiroRecebido = document.getElementById('decimoTerceiro').value;

    if (!salario || !dataInicio || !dataFim) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    const inicio = new Date(dataInicio.split('/').reverse().join('-'));
    const fim = new Date(dataFim.split('/').reverse().join('-'));
    if (inicio > fim) {
        alert("A data de início do trabalho não pode ser posterior à data de término.");
        return;
    }

    const tempoTrabalhado = (fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    const anosTrabalhados = Math.floor(tempoTrabalhado);
    const mesesTrabalhadosNoAno = Math.floor((tempoTrabalhado % 1) * 12);

    const diasTrabalhados = fim.getDate();
    const valorRemanescenteSalario = (salario / 30) * diasTrabalhados;

    let valorFeriasVencidas = 0;
    let valorFeriasProporcionais = 0;

    if (feriasRecebidas === 'N') {
        // Férias vencidas
        valorFeriasVencidas = salario * anosTrabalhados;
        const valorFeriasVencidasAcrescidas = valorFeriasVencidas / 3;

        // Férias proporcionais
        valorFeriasProporcionais = (salario / 12) * mesesTrabalhadosNoAno;
        const valorFeriasProporcionaisAcrescidas = valorFeriasProporcionais / 3;

        valorFeriasVencidas += valorFeriasVencidasAcrescidas;
        valorFeriasProporcionais += valorFeriasProporcionaisAcrescidas;
    } else {
        // Apenas férias proporcionais
        valorFeriasProporcionais = (salario / 12) * mesesTrabalhadosNoAno;
        const valorFeriasProporcionaisAcrescidas = valorFeriasProporcionais / 3;
        valorFeriasProporcionais += valorFeriasProporcionaisAcrescidas;
    }

    let valorDecimoTerceiroAnual = 0;
    let valorDecimoTerceiroProporcional = 0;

    if (decimoTerceiroRecebido === 'N') {
        valorDecimoTerceiroAnual = salario * anosTrabalhados;
        valorDecimoTerceiroProporcional = (salario / 12) * mesesTrabalhadosNoAno;
    } else {
        valorDecimoTerceiroProporcional = (salario / 12) * mesesTrabalhadosNoAno;
    }

    const diasAvisoPrevio = 30 + (anosTrabalhados * 3);
    const valorAvisoPrevio = (salario / 30) * diasAvisoPrevio;

    const valorFGTS = salario * 0.08 * (anosTrabalhados * 12 + mesesTrabalhadosNoAno);
    const multaFGTS = valorFGTS * 0.4;

    const totalRescisao = valorRemanescenteSalario + valorFeriasVencidas + valorFeriasProporcionais + valorDecimoTerceiroAnual + valorDecimoTerceiroProporcional + valorAvisoPrevio + multaFGTS;

    const totalVerbas = totalRescisao;

    const resultadoHTML = `
        <p>O valor líquido aproximado da sua rescisão é de: <strong>R$${totalVerbas.toFixed(2)}</strong></p>
        <p>Confira o Detalhamento do seu cálculo:</p>
        <div class="table-responsive" id="get-scroll">
            <table class="table tb-values">
                <thead>
                    <tr>
                        <th class="th-evento">Evento</th>
                        <th class="th-ref">Ref.</th>
                        <th class="th-verba">Verba</th>
                        <th class="th-desconto">Desconto</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="tb-evento">Saldo Salário</td>
                        <td>${diasTrabalhados}</td>
                        <td data-calc="positive">R$${valorRemanescenteSalario.toFixed(2)}</td>
                        <td class="empty-cell">-</td>
                    </tr>
                    <tr>
                        <td>Décimo Terceiro Salário</td>
                        <td>${anosTrabalhados} anos</td>
                        <td data-calc="positive">R$${valorDecimoTerceiroAnual.toFixed(2)}</td>
                        <td class="empty-cell">-</td>
                    </tr>
                    <tr>
                        <td>Décimo Terceiro Salário Proporcional</td>
                        <td>${mesesTrabalhadosNoAno} meses</td>
                        <td data-calc="positive">R$${valorDecimoTerceiroProporcional.toFixed(2)}</td>
                        <td class="empty-cell">-</td>
                    </tr>
                    <tr>
                        <td>Férias Vencidas + 1/3</td>
                        <td>-</td>
                        <td data-calc="positive">R$${valorFeriasVencidas.toFixed(2)}</td>
                        <td class="empty-cell">-</td>
                    </tr>
                    <tr>
                        <td>Férias Proporcionais + 1/3</td>
                        <td>-</td>
                        <td data-calc="positive">R$${valorFeriasProporcionais.toFixed(2)}</td>
                        <td class="empty-cell">-</td>
                    </tr>
                    <tr>
                        <td>Aviso Prévio</td>
                        <td>${diasAvisoPrevio}</td>
                        <td data-calc="positive">R$${valorAvisoPrevio.toFixed(2)}</td>
                        <td class="empty-cell">-</td>
                    </tr>
                    <tr>
                        <td>Multa FGTS</td>
                        <td>-</td>
                        <td data-calc="positive">R$${multaFGTS.toFixed(2)}</td>
                        <td class="empty-cell">-</td>
                    </tr>
                </tbody>
                <tr class="tb-total">
                    <td class="tb-evento">Total:</td>
                    <td class="tb-ref"></td>
                    <td class="calc-total-positive">R$${totalVerbas.toFixed(2)}</td>
                    <td class="empty-cell">-</td>
                </tr>
            </table>
        </div>
    `;

    localStorage.setItem('resultadoHTML', resultadoHTML);
    window.location.href = `resultado.html`;
}

