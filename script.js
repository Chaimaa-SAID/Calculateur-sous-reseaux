function addHostsInput() {
    const numSubnets = document.getElementById('num-subnets').value;
    const hostsInput = document.getElementById('hosts-input');
    hostsInput.innerHTML = '';
  
    for (let i = 0; i < numSubnets; i++) {
      const label = document.createElement('label');
      label.textContent = `Hosts for Subnet ${i + 1}: `;
      const input = document.createElement('input');
      input.type = 'number';
      input.min = '1';
      hostsInput.appendChild(label);
      hostsInput.appendChild(input);
      hostsInput.appendChild(document.createElement('br'));
    }
  }
  
  function calculateSubnets() {
    const networkAddress = document.getElementById('network-address').value;
    const subnetMask = document.getElementById('subnet-mask').value;
    const numSubnets = parseInt(document.getElementById('num-subnets').value);
    const hosts = [];
  
    for (let i = 0; i < numSubnets; i++) {
      const hostInput = document.getElementById('hosts-input').querySelectorAll('input')[i].value;
      hosts.push(parseInt(hostInput));
    }
  
    let currentNetwork = ipToInt(networkAddress);
    let resultsHTML = '<h2>Results</h2><table><tr><th>Nom</th><th>Hôtes nécessaires</th><th>Hôtes disponibles</th><th>Hôtes inutilisés</th><th>Adresse réseau</th><th>Masque de sous-réseau</th><th>Plage utilisable</th><th>Diffuser</th></tr>';
  
    for (let i = 0; i < numSubnets; i++) {
      let subnetSize = hosts[i] + 2;
      let mask = 32 - Math.ceil(Math.log2(subnetSize));
      let subnetMaskString = getSubnetMask(mask);
  
      let hostsAvailable = Math.pow(2, 32 - mask) - 2;
      let networkAddressString = intToIP(currentNetwork);
      let broadcastAddressString = intToIP(currentNetwork + hostsAvailable + 1);
  
      resultsHTML += `<tr><td>Host${i + 1}</td><td>${hosts[i]}</td><td>${hostsAvailable}</td><td>${hostsAvailable - hosts[i]}</td><td>${networkAddressString}</td><td>${subnetMaskString}</td><td>${intToIP(currentNetwork + 1)} - ${intToIP(currentNetwork + hostsAvailable)}</td><td>${broadcastAddressString}</td></tr>`;
  
      currentNetwork += hostsAvailable + 2;
    }
  
    resultsHTML += '</table>';
    document.getElementById('results').innerHTML = resultsHTML;
  }
  
  function getSubnetMask(mask) {
    let subnetMask = '';
    for (let i = 0; i < 4; i++) {
      let octet = 0;
      if (mask >= 8) {
        octet = 255;
        mask -= 8;
      } else {
        for (let j = 7; j >= 8 - mask; j--) {
          octet += Math.pow(2, j);
        }
        mask = 0;
      }
      subnetMask += octet;
      if (i !== 3) {
        subnetMask += '.';
      }
    }
    return subnetMask;
  }
  
  function ipToInt(ip) {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0);
  }
  
  function intToIP(int) {
    return [(int >> 24) & 255, (int >> 16) & 255, (int >> 8) & 255, int & 255].join('.');
  }
  