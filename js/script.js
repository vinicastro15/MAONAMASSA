// ==================== DADOS INICIAIS ====================
let ofertas = [
    { id: 1, titulo: "Reforma completa de banheiro", descricao: "Troca de azulejos, instalação de novo box e pia.", estado: "BA", cidade: "Salvador", bairro: "Amaralina", categoria: "Reformas", subcategoria: "Residencial", dataPublicacao: new Date().toISOString(), contatoCompleto: "João Silva - (11) 98765-4321", orcamento: "R$ 3.000 - R$ 5.000", premiumApenas: true, candidatos: [] },
    { id: 2, titulo: "Manutenção elétrica residencial", descricao: "Troca de fiação, instalação de luminárias.", estado: "BA", cidade: "Salvador", bairro: "Pituba", categoria: "Elétrica", subcategoria: "Residencial", dataPublicacao: new Date().toISOString(), contatoCompleto: "Maria Santos - (21) 98877-6655", orcamento: "R$ 500 - R$ 800", premiumApenas: true, candidatos: [] },
    { id: 3, titulo: "Pintura de apartamento", descricao: "Pintura completa de 2 quartos e sala.", estado: "ba", cidade: "Salvador", bairro: "Salvador", categoria: "Reformas", subcategoria: "Residencial", dataPublicacao: new Date(Date.now() - 15*86400000).toISOString(), contatoCompleto: "Carlos Eduardo - (31) 99988-7766", orcamento: "R$ 1.200 - R$ 1.800", premiumApenas: true, candidatos: [] },
    { id: 4, titulo: "Desentupimento de encanamento", descricao: "Desentupimento emergencial de pias e vasos.", estado: "BA", cidade: "Salvador", bairro: "Barra", categoria: "Hidráulica", subcategoria: "Urgente", dataPublicacao: new Date().toISOString(), contatoCompleto: "Ana Paula - (71) 91234-5678", orcamento: "R$ 200 - R$ 400", premiumApenas: true, candidatos: [] },
];

// ==================== OFERTAS ESPECIAIS ====================
const ofertasEspeciais = [
    { id: 101, tipo: "ferramenta", icone: "🔧", titulo: "Kit de Ferramentas Profissional", descricao: "Jogo com 50 peças, chaves, alicates e martelo", preco: "R$ 299,90", precoOriginal: "R$ 499,90", parceiro: "Ferramentas Silva", link: "#" },
    { id: 102, tipo: "ferramenta", icone: "⚡", titulo: "Furadeira de Impacto 650W", descricao: "Bivolt, mandril automático, 5 velocidades", preco: "R$ 349,90", precoOriginal: "R$ 599,90", parceiro: "Bosch", link: "#" },
    { id: 103, tipo: "epi", icone: "🛡️", titulo: "Kit EPI Completo", descricao: "Capacete, luvas, óculos e protetor auricular", preco: "R$ 89,90", precoOriginal: "R$ 159,90", parceiro: "Segurança Total", link: "#" },
    { id: 104, tipo: "epi", icone: "👷", titulo: "Cinto de Segurança para Trabalho em Altura", descricao: "Com duplo talabarte, certificado ABNT", preco: "R$ 179,90", precoOriginal: "R$ 299,90", parceiro: "Equipaço", link: "#" },
    { id: 105, tipo: "curso", icone: "📚", titulo: "NR-10 - Segurança em Instalações Elétricas", descricao: "Curso online com certificado reconhecido", preco: "R$ 97,00", precoOriginal: "R$ 297,00", parceiro: "Senai", link: "#" },
    { id: 106, tipo: "curso", icone: "🎓", titulo: "Pintura Profissional - Técnicas Avançadas", descricao: "Do básico ao expert, com bônus de texturas", preco: "R$ 149,90", precoOriginal: "R$ 399,90", parceiro: "Udemy", link: "#" },
    { id: 107, tipo: "curso", icone: "💻", titulo: "Gestão de Obras e Orçamentos", descricao: "Aprenda a precificar e gerenciar seus projetos", preco: "R$ 199,90", precoOriginal: "R$ 499,90", parceiro: "Sebrae", link: "#" },
    { id: 108, tipo: "ferramenta", icone: "📏", titulo: "Nível a Laser Autonivelante", descricao: "Precisão em alinhamentos, alcance de 20m", preco: "R$ 189,90", precoOriginal: "R$ 359,90", parceiro: "Stanley", link: "#" },
];

// Estado da aplicação
let contratanteLogado = false;
let profissionalLogado = false;
let profissionalNome = "";
let profissionalProfissao = "";
let profissionalPlano = "gratuito";
let profissionalFeatures = { destaque: false, dominio: false, analise: false };
let termoBusca = "";
let filtroCategoria = "todas";
let candidaturasDoProfissional = [];

// ==================== FUNÇÕES AUXILIARES ====================
function isWithin30Days(dateISO) {
    const pub = new Date(dateISO);
    const now = new Date();
    const diffDays = (now - pub) / (1000 * 60 * 60 * 24);
    return diffDays <= 30;
}

function filtrarServicosAtivos() {
    return ofertas.filter(o => isWithin30Days(o.dataPublicacao));
}

function calcularDiasRestantes(dataISO) {
    const pub = new Date(dataISO);
    const expira = new Date(pub.getTime() + 30*24*60*60*1000);
    const hoje = new Date();
    const diff = Math.ceil((expira - hoje) / (1000*60*60*24));
    return diff > 0 ? diff : 0;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// ==================== RENDERIZAÇÃO OFERTAS PRINCIPAIS ====================
function renderizarOfertas() {
    let ativos = filtrarServicosAtivos();
    
    if (filtroCategoria !== "todas") {
        ativos = ativos.filter(o => o.categoria === filtroCategoria);
    }
    
    if (termoBusca.trim() !== "") {
        const busca = termoBusca.toLowerCase();
        ativos = ativos.filter(o => o.titulo.toLowerCase().includes(busca) || o.descricao.toLowerCase().includes(busca));
    }
    
    if (profissionalFeatures.destaque) {
        ativos.sort((a, b) => (a.id === 1 || a.id === 3) ? -1 : 0);
    }
    
    const container = document.getElementById("servicesContainer");
    if (ativos.length === 0) {
        container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding: 3rem;">Nenhum serviço ativo no momento.</div>`;
        return;
    }
    
    container.innerHTML = ativos.map(serv => {
        const dataPub = new Date(serv.dataPublicacao).toLocaleDateString('pt-BR');
        const isFeatured = (serv.id === 1 || serv.id === 3) && profissionalFeatures.destaque;
        let contatoHtml = "";
        let candidatarHtml = "";
        
        if (profissionalLogado && profissionalPlano === "premium") {
            contatoHtml = `<div style="margin-top: 8px; background: #e8f0f8; border-radius: 20px; padding: 0.5rem; font-size:0.8rem;">
                <i class="fas fa-phone-alt"></i> Contato: ${escapeHtml(serv.contatoCompleto)}<br>
                <i class="fas fa-money-bill"></i> Orçamento: ${escapeHtml(serv.orcamento || 'A combinar')}
            </div>`;
            candidatarHtml = `<button class="btn-candidatar" data-id="${serv.id}"><i class="fas fa-paper-plane"></i> Candidatar-se a esta vaga</button>`;
        } else if (profissionalLogado && profissionalPlano !== "premium") {
            contatoHtml = `<div class="info-premium-lock"><i class="fas fa-lock"></i> 🔒 Assine o Plano Premium para ver contato e se candidatar</div>`;
        } else {
            contatoHtml = `<div class="info-premium-lock"><i class="fas fa-crown"></i> Faça login como Profissional Premium para visualizar contato completo e se candidatar</div>`;
        }
        
        return `
            <div class="service-card ${isFeatured ? 'featured' : ''}">
                ${isFeatured ? '<div class="premium-badge-card"><i class="fas fa-star"></i> Destaque</div>' : ''}
                <div class="service-title">${escapeHtml(serv.titulo)}</div>
                <div class="service-desc"><strong>Descrição:</strong> ${escapeHtml(serv.descricao)}</div>
                <div><i class="fas fa-map-marker-alt"></i> ${escapeHtml(serv.cidade)}/${escapeHtml(serv.estado)} - ${escapeHtml(serv.bairro)}</div>
                <div><i class="fas fa-tag"></i> Categoria: ${escapeHtml(serv.categoria)}</div>
                <div class="service-meta">
                    <span><i class="far fa-calendar-alt"></i> Publicado: ${dataPub}</span>
                    <span><i class="far fa-clock"></i> Expira em ${calcularDiasRestantes(serv.dataPublicacao)} dias</span>
                </div>
                ${contatoHtml}
                ${candidatarHtml}
            </div>
        `;
    }).join('');
    
    document.querySelectorAll('.btn-candidatar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const servicoId = parseInt(btn.getAttribute('data-id'));
            abrirCandidatura(servicoId);
        });
    });
}

// ==================== RENDERIZAR OFERTAS ESPECIAIS ====================
function renderizarOfertasEspeciais() {
    const container = document.getElementById('ofertasEspeciaisContainer');
    if (!container) return;
    
    container.innerHTML = ofertasEspeciais.map(oferta => `
        <div class="oferta-especial-card">
            <div class="oferta-icon">${oferta.icone}</div>
            <div class="oferta-titulo">${escapeHtml(oferta.titulo)}</div>
            <div class="oferta-desc">${escapeHtml(oferta.descricao)}</div>
            <div class="oferta-preco">${oferta.preco} <span style="text-decoration: line-through; font-size:0.7rem;">${oferta.precoOriginal}</span></div>
            <div class="oferta-parceiro"><i class="fas fa-store"></i> ${escapeHtml(oferta.parceiro)}</div>
            <button class="btn-oferta" data-oferta-id="${oferta.id}">Ver oferta <i class="fas fa-arrow-right"></i></button>
        </div>
    `).join('');
    
    document.querySelectorAll('.btn-oferta').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const ofertaId = parseInt(btn.getAttribute('data-oferta-id'));
            const oferta = ofertasEspeciais.find(o => o.id === ofertaId);
            alert(`🔨 Oferta: ${oferta.titulo}\nPreço especial: ${oferta.preco}\nParceiro: ${oferta.parceiro}\nEntre em contato pelo nosso WhatsApp para mais detalhes!`);
        });
    });
}

// ==================== CATEGORIAS ====================
function carregarCategorias() {
    const cats = [...new Set(ofertas.map(o => o.categoria))];
    const container = document.getElementById("categoriasContainer");
    container.innerHTML = `<div class="cat-chip ${filtroCategoria === 'todas' ? 'active' : ''}" data-cat="todas">Todas</div>` +
        cats.map(cat => `<div class="cat-chip ${filtroCategoria === cat ? 'active' : ''}" data-cat="${cat}">${cat}</div>`).join('');
    
    document.querySelectorAll('.cat-chip').forEach(el => {
        el.addEventListener('click', () => {
            filtroCategoria = el.getAttribute('data-cat');
            carregarCategorias();
            renderizarOfertas();
            atualizarBannerCategoria();
        });
    });
}

function atualizarBannerCategoria() {
    const bannerDiv = document.getElementById('bannerCategoria');
    const bannerTexto = document.getElementById('bannerCategoriaTexto');
    if (filtroCategoria !== 'todas' && filtroCategoria) {
        bannerDiv.style.display = 'block';
        bannerTexto.innerHTML = `🔨 Anúncio: Materiais para ${filtroCategoria} com desconto! Tintas, ferramentas e EPIs.`;
    } else {
        bannerDiv.style.display = 'none';
    }
}

// ==================== MODAIS ====================
function openModal(id) { 
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'flex'; 
}

function closeModal(id) { 
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'none'; 
}

// ==================== TELA DO CONTRATANTE ====================
function initContratanteTela() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const tab = btn.getAttribute('data-tab');
            document.getElementById('tabLogin').classList.toggle('active', tab === 'login');
            document.getElementById('tabCadastro').classList.toggle('active', tab === 'cadastro');
        });
    });
    
    document.getElementById('loginContratanteSubmit').onclick = () => {
        const email = document.getElementById('contratanteEmail').value;
        if(email.trim() === "") {
            alert("Insira um e-mail");
        } else {
            contratanteLogado = true;
            alert(`✅ Contratante logado! Agora você pode publicar serviços.`);
            closeModal('modalLoginContratante');
        }
    };
    
    document.getElementById('cadastroContratanteSubmit').onclick = () => {
        const nome = document.getElementById('contratanteNome').value;
        if(nome.trim() === "") {
            alert("Preencha seu nome");
        } else {
            contratanteLogado = true;
            alert(`✅ Conta criada! Bem-vindo(a) ${nome}. Agora você pode publicar serviços.`);
            closeModal('modalLoginContratante');
        }
    };
}

// ==================== TELA DO PROFISSIONAL ====================
function initProfissionalTela() {
    document.querySelectorAll('.tab-btn-prof').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn-prof').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const tab = btn.getAttribute('data-prof-tab');
            document.getElementById('profLoginTab').classList.toggle('active', tab === 'login');
            document.getElementById('profCadastroTab').classList.toggle('active', tab === 'cadastro');
        });
    });
    
    document.querySelectorAll('.painel-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.painel-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const tabId = tab.getAttribute('data-painel-tab');
            document.querySelectorAll('.painel-tab-content').forEach(content => content.classList.remove('active'));
            if (tabId === 'meu-plano') document.getElementById('painelMeuPlano').classList.add('active');
            if (tabId === 'ofertas-especiais') document.getElementById('painelOfertasEspeciais').classList.add('active');
            if (tabId === 'minhas-candidaturas') document.getElementById('painelMinhasCandidaturas').classList.add('active');
        });
    });
    
    document.getElementById('loginProfissionalSubmit').onclick = () => {
        const email = document.getElementById('profissionalEmail').value;
        if(email === "") { 
            alert("Digite um email"); 
            return; 
        }
        profissionalLogado = true;
        profissionalNome = "Profissional";
        profissionalProfissao = "Profissional Autônomo";
        atualizarDashboardProfissional();
        alert(`✅ Profissional logado! Seu plano: ${profissionalPlano}. Acesse seu dashboard para upgrades e ofertas especiais.`);
        renderizarOfertas();
        closeModal('modalLoginProfissional');
    };
    
    document.getElementById('cadastroProfissionalSubmit').onclick = () => {
        const nome = document.getElementById('profissionalNome').value;
        const profissao = document.getElementById('profissionalProfissao').value;
        if(nome === "") { alert("Preencha seu nome"); return; }
        profissionalLogado = true;
        profissionalNome = nome;
        profissionalProfissao = profissao || "Profissional Autônomo";
        atualizarDashboardProfissional();
        alert(`✅ Conta criada! Bem-vindo(a) ${nome}. Complete seu cadastro e assine o Premium!`);
        renderizarOfertas();
        closeModal('modalLoginProfissional');
    };
    
    document.getElementById('btnDestaque')?.addEventListener('click', () => ativarFeature('destaque', 19));
    document.getElementById('btnDominio')?.addEventListener('click', () => ativarFeature('dominio', 29));
    document.getElementById('btnAnalise')?.addEventListener('click', () => ativarFeature('analise', 39));
    
    document.getElementById('upgradePremiumCompletoBtn')?.addEventListener('click', () => {
        profissionalPlano = "premium";
        profissionalFeatures = { destaque: true, dominio: true, analise: true };
        atualizarDashboardProfissional();
        renderizarOfertas();
        alert("✨ Parabéns! Agora você é PREMIUM COMPLETO! ✨\n✓ Selo de Destaque\n✓ Domínio Próprio\n✓ Análise de Dados\n✓ Visualiza contatos e pode se candidatar\n✓ Ofertas exclusivas no painel!");
    });
}

function ativarFeature(feature, price) {
    if (profissionalPlano === "premium") {
        profissionalFeatures[feature] = true;
        alert(`✅ ${feature === 'destaque' ? 'Selo de Destaque' : feature === 'dominio' ? 'Domínio Próprio' : 'Análise de Dados'} ativado!`);
    } else {
        alert(`⚠️ Assine o Plano Premium Completo (R$ 79/mês) para ativar ${feature}.`);
    }
    atualizarDashboardProfissional();
    renderizarOfertas();
}

function atualizarDashboardProfissional() {
    const dashboardDiv = document.getElementById('profissionalDashboard');
    const planoStatusBadge = document.getElementById('planoStatusBadge');
    const analyticsSection = document.getElementById('analyticsSection');
    const dominioLinkDiv = document.getElementById('dominioLink');
    const nomeDisplay = document.getElementById('profissionalNomeDisplay');
    const profissaoDisplay = document.getElementById('profissionalProfissaoDisplay');
    
    if(profissionalLogado) {
        dashboardDiv.style.display = 'block';
        if(nomeDisplay) nomeDisplay.textContent = profissionalNome;
        if(profissaoDisplay) profissaoDisplay.textContent = profissionalProfissao;
        
        const planoText = profissionalPlano === 'premium' ? 'PREMIUM ✨' : 'Gratuito';
        if(planoStatusBadge) planoStatusBadge.innerHTML = planoText;
        
        if(profissionalFeatures.analise && analyticsSection) {
            analyticsSection.style.display = 'block';
            document.getElementById('visualizacoesPerfil').innerText = Math.floor(Math.random() * 50) + 10;
            document.getElementById('cliquesContato').innerText = Math.floor(Math.random() * 20) + 3;
            document.getElementById('bairrosOrigem').innerText = Math.floor(Math.random() * 8) + 2;
        } else if(analyticsSection) {
            analyticsSection.style.display = 'none';
        }
        
        if(profissionalFeatures.dominio && dominioLinkDiv) {
            dominioLinkDiv.style.display = 'block';
            dominioLinkDiv.innerHTML = `<i class="fas fa-link"></i> maonamassa.com/${profissionalNome.toLowerCase().replace(/\s/g, '-')}`;
        } else if(dominioLinkDiv) {
            dominioLinkDiv.style.display = 'none';
        }
        
        document.getElementById('statusDestaque').innerHTML = profissionalFeatures.destaque ? '✓ Ativo' : '';
        document.getElementById('statusDominio').innerHTML = profissionalFeatures.dominio ? '✓ Ativo' : '';
        document.getElementById('statusAnalise').innerHTML = profissionalFeatures.analise ? '✓ Ativo' : '';
        
        document.getElementById('premiumInfo').innerHTML = profissionalPlano === 'premium' ? 
            '<i class="fas fa-check-circle"></i> Você é Premium! Aproveite todos os benefícios exclusivos.' :
            '<i class="fas fa-crown"></i> Assine o Premium para destaque, domínio próprio, análise de dados e ofertas exclusivas!';
        
        atualizarMinhasCandidaturas();
        renderizarOfertasEspeciais();
    }
}

function atualizarMinhasCandidaturas() {
    const container = document.getElementById('minhasCandidaturasList');
    if(container && candidaturasDoProfissional.length > 0) {
        container.innerHTML = candidaturasDoProfissional.map(c => `
            <div class="application-item">
                <strong>${c.servicoTitulo}</strong><br>
                <small>${c.mensagem.substring(0, 100)}${c.mensagem.length > 100 ? '...' : ''}</small><br>
                <small style="color: #888;">Enviado em: ${new Date(c.data).toLocaleDateString()}</small>
            </div>
        `).join('');
    } else if(container) {
        container.innerHTML = '<p style="font-size:0.85rem; color:#888; text-align:center;">Nenhuma candidatura ainda. Candidate-se às vagas na página inicial!</p>';
    }
}

// ==================== PUBLICAR SERVIÇO ====================
function initPublicarServico() {
    document.getElementById('formPublicar').addEventListener('submit', (e) => {
        e.preventDefault();
        
        if(!contratanteLogado && !profissionalLogado) {
            alert("⚠️ Você precisa estar logado como CONTRATANTE para publicar um serviço.");
            openModal('modalLoginContratante');
            return;
        }
        
        const categoria = document.getElementById('categoriaServico').value;
        const subcategoria = document.getElementById('subcategoriaServico').value;
        const nomeServico = document.getElementById('nomeServico').value.trim();
        const estado = document.getElementById('estadoServico').value.trim();
        const cidade = document.getElementById('cidadeServico').value.trim();
        const bairro = document.getElementById('bairroServico').value.trim();
        const descricao = document.getElementById('descricaoServico').value.trim();
        const orcamento = document.getElementById('orcamento').value;
        
        if(!categoria || !nomeServico) { 
            alert("Preencha categoria e nome do serviço."); 
            return; 
        }
        
        const novoId = Date.now();
        const novaOferta = {
            id: novoId,
            titulo: nomeServico,
            descricao: descricao || "Sem descrição adicional",
            estado: estado || "BR",
            cidade: cidade || "Cidade",
            bairro: bairro || "Bairro",
            categoria: categoria,
            subcategoria: subcategoria,
            dataPublicacao: new Date().toISOString(),
            contatoCompleto: `Contratante via plataforma - solicitante: ${contratanteLogado ? 'Cliente' : 'Anônimo'} - Telefone: (11) 99999-9999`,
            orcamento: orcamento || "A combinar",
            premiumApenas: true,
            candidatos: []
        };
        
        ofertas.push(novaOferta);
        renderizarOfertas();
        carregarCategorias();
        closeModal('modalPublicarServico');
        alert("✅ Serviço publicado com sucesso! Expira em 30 dias.");
        document.getElementById('formPublicar').reset();
    });
}

// ==================== CANDIDATURA ====================
let servicoCandidatoId = null;

function abrirCandidatura(servicoId) {
    if (!profissionalLogado || profissionalPlano !== 'premium') {
        alert("⚠️ Apenas profissionais PREMIUM podem se candidatar às vagas! Assine o plano.");
        openModal('modalLoginProfissional');
        return;
    }
    const servico = ofertas.find(s => s.id === servicoId);
    if (servico) {
        document.getElementById('candidatarServicoNome').innerHTML = `<strong>Candidatar-se a:</strong> ${servico.titulo}<br><small>${servico.cidade}/${servico.estado}</small>`;
        servicoCandidatoId = servicoId;
        openModal('modalCandidatar');
    }
}

document.getElementById('confirmarCandidatura')?.addEventListener('click', () => {
    const mensagem = document.getElementById('mensagemCandidatura').value;
    if(!mensagem.trim()) {
        alert("Digite uma mensagem para o contratante");
        return;
    }
    const servico = ofertas.find(s => s.id === servicoCandidatoId);
    if(servico) {
        candidaturasDoProfissional.push({
            servicoId: servico.id,
            servicoTitulo: servico.titulo,
            mensagem: mensagem,
            data: new Date().toISOString()
        });
        alert(`✅ Candidatura enviada para "${servico.titulo}"! O contratante entrará em contato.`);
        closeModal('modalCandidatar');
        document.getElementById('mensagemCandidatura').value = '';
        atualizarMinhasCandidaturas();
    }
});

// ==================== EVENTOS GLOBAIS ====================
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal');
            closeModal(modalId);
        });
    });
    
    window.onclick = (e) => { 
        if(e.target.classList.contains('modal')) e.target.style.display = 'none'; 
    };
    
    document.getElementById('btnHome').addEventListener('click', () => {
        termoBusca = "";
        filtroCategoria = "todas";
        document.getElementById('searchInput').value = "";
        carregarCategorias();
        renderizarOfertas();
    });
    
    document.getElementById('btnLoginContratante').onclick = () => openModal('modalLoginContratante');
    document.getElementById('btnLoginProfissional').onclick = () => openModal('modalLoginProfissional');
    document.getElementById('btnPublicarServicoTop').onclick = () => openModal('modalPublicarServico');
    
    document.getElementById('buscarBtn').addEventListener('click', () => {
        termoBusca = document.getElementById('searchInput').value;
        renderizarOfertas();
    });
    
    document.getElementById('searchInput').addEventListener('keyup', (e) => {
        if(e.key === 'Enter') { 
            termoBusca = e.target.value; 
            renderizarOfertas(); 
        }
    });
    
    initContratanteTela();
    initProfissionalTela();
    initPublicarServico();
    carregarCategorias();
    renderizarOfertas();
    renderizarOfertasEspeciais();
});