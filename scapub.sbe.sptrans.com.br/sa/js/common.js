function colocarCredito (){
  var divCredito = document.getElementById("divCredito");
  var novoInput = document.createElement("input");
  var novoP =  document.createElement("p");
  var novoBr = document.createElement("br");
  divCredito.appendChild(novoBr);
  divCredito.appendChild(novoP);
  divCredito.appendChild(novoInput);
  novoP.innerHTML = "Digite o valor em reais que deseja colocar de créditos:";
  
  var novoBt = document.createElement("input");
  novoBt.type = "button";
  novoBt.value = "OK";
  novoBt.id="btOk";
  
  divCredito.appendChild(novoBt);

}

function msgSucesso(){
    alert("Bilhete Único Carregado com Sucesso!");
}

function verSaldo (){
  var divCredito = document.getElementById("divCredito");
  var novoP =  document.createElement("p");
  var novoBr = document.createElement("br");
  var inBilheteNumero = document.getElementById("inBilheteNumero");
  divCredito.appendChild(novoBr);
  divCredito.appendChild(novoP);
  novoP.innerHTML = "Saldo atual no cartão " + inBilheteNumero.value+ ":";
  divCredito.appendChild(novoBr);

var saldoComum =  document.createElement("p");
var saldoEstudante =  document.createElement("p");
divCredito.appendChild(saldoComum);
saldoComum.innerHTML="Saldo comum: R$22,30";
divCredito.appendChild(saldoEstudante);
saldoEstudante.innerHTML="Saldo estudante: R$56,70";
}

