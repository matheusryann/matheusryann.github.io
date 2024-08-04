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

    const diasTrabalhados = fim.getDate();
    const valorRemanescenteSalario = (salario / 30) * diasTrabalhados;

    let valorFeriasAcumuladas = 0;
    let valorFeriasProporcionais = 0;
    let valorFeriasProporcionaisAcrescidas = 0;

    if (feriasRecebidas === 'N') {
        if (anosTrabalhados >= 2) {
            valorFeriasAcumuladas = (salario / 3) * 2; // pagamento em dobro após dois anos
        } else {
            valorFeriasAcumuladas = salario / 3;
        }
    }

    const mesesTrabalhadosNoAno = (tempoTrabalhado % 1) * 12;
    valorFeriasProporcionais = (salario / 12) * mesesTrabalhadosNoAno;
    valorFeriasProporcionaisAcrescidas = valorFeriasProporcionais / 3;

    let valorDecimoTerceiro = 0;
    let valorDecimoTerceiroProporcional = 0;

    if (decimoTerceiroRecebido === 'N') {
        valorDecimoTerceiro = (salario / 12) * mesesTrabalhadosNoAno;
        valorDecimoTerceiroProporcional = valorDecimoTerceiro;
    } else {
        valorDecimoTerceiroProporcional = (salario / 12) * mesesTrabalhadosNoAno;
    }

    const diasAvisoPrevio = 30 + (anosTrabalhados * 3);
    const valorAvisoPrevio = (salario / 30) * diasAvisoPrevio;

    const valorFGTS = salario * 0.08 * tempoTrabalhado;
    const multaFGTS = valorFGTS * 0.4;

    const totalRescisao = valorRemanescenteSalario + valorFeriasAcumuladas + valorFeriasProporcionais + valorFeriasProporcionaisAcrescidas + valorDecimoTerceiro + valorAvisoPrevio + multaFGTS;

    const inssSalario = valorRemanescenteSalario * 0.08;
    const inssDecimoTerceiro = valorDecimoTerceiroProporcional * 0.08;
    const inssAvisoPrevio = valorAvisoPrevio * 0.08;

    const totalDescontos = inssSalario + inssDecimoTerceiro + inssAvisoPrevio;
    const totalVerbas = totalRescisao;

    const resultadoHTML = `
        <p>O valor líquido aproximado da sua rescisão é de: <strong>R$${(totalVerbas - totalDescontos).toFixed(2)}</strong></p>
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
                        <td>INSS Saldo Salário</td>
                        <td>8%</                        <td class="empty-cell">-</td>
                        <td data-calc="negative">R$${inssSalario.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>13º Proporcional</td>
                        <td>${mesesTrabalhadosNoAno.toFixed(2)}</td>
                        <td data-calc="positive">R$${valorDecimoTerceiroProporcional.toFixed(2)}</td>
                        <td class="empty-cell">-</td>
                    </tr>
                    <tr>
                        <td>INSS 13º Proporcional</td>
                        <td>8%</                        <td class="empty-cell">-</td>
                        <td data-calc="negative">R$${inssDecimoTerceiro.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Férias não Recebidas</td>
                        <td>-</td>
                        <td data-calc="positive">R$${valorFeriasAcumuladas.toFixed(2)}</td>
                        <td class="empty-cell">-</td>
                    </tr>
                    <tr>
                        <td>Férias Proporcionais</td>
                        <td>-</td>
                        <td data-calc="positive">R$${valorFeriasProporcionais.toFixed(2)}</td>
                        <td class="empty-cell">-</td>
                    </tr>
                    <tr>
                        <td>1/3 Férias Proporcionais</td>
                        <td>-</td>
                        <td data-calc="positive">R$${valorFeriasProporcionaisAcrescidas.toFixed(2)}</td>
                        <td class="empty-cell">-</td>
                    </tr>
                    <tr>
                        <td>Aviso Prévio</td>
                        <td>${diasAvisoPrevio}</td>
                        <td data-calc="positive">R$${valorAvisoPrevio.toFixed(2)}</td>
                        <td class="empty-cell">-</td>
                    </tr>
                    <tr>
                        <td>INSS Aviso Prévio</td>
                        <td>8%</                        <td class="empty-cell">-</td>
                        <td data-calc="negative">R$${inssAvisoPrevio.toFixed(2)}</td>
                    </tr>
                </tbody>
                <tr class="tb-total">
                    <td class="tb-evento">Total:</td>
                    <td class="tb-ref"></td>
                    <td class="calc-total-positive">R$${totalVerbas.toFixed(2)}</td>
                    <td class="calc-total-negative">R$${totalDescontos.toFixed(2)}</td>
                </tr>
            </table>
        </div>
    `;

    localStorage.setItem('resultadoHTML', resultadoHTML);
    window.location.href = `resultado.html`;
}
