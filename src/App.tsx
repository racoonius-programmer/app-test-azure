import { useEffect, useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { tokenRequest } from './authConfig';
import { fetchConToken } from './apiClient';
import RutaProtegida from './components/RutaProtegida';
import './App.css';

function HomePage() {
  const { instance, accounts, inProgress } = useMsal();
  const navigate = useNavigate();
  const account = instance.getActiveAccount() ?? accounts[0];
  const bloqueado = inProgress !== InteractionStatus.None;

  useEffect(() => {
    document.title = 'Wepay | Inicio';
  }, []);

  async function entrar() {
    const result = await instance.loginPopup({
      ...tokenRequest,
      prompt: 'select_account',
    });
    instance.setActiveAccount(result.account);
    navigate('/perfil');
  }

  function acceder() {
    if (account) {
      navigate('/perfil');
      return;
    }

    void entrar();
  }

  return (
    <main className="wepay-page">
      <header className="topbar">
        <div className="brand-lockup">
          <span className="brand-mark">W</span>
          <div>
            <p className="eyebrow">Tienda gamer premium</p>
            <strong>Wepay</strong>
          </div>
        </div>
        <div className="topbar-actions">
          <span className="status-pill">
            {account ? 'Sesión activa' : 'Acceso privado disponible'}
          </span>
          <button
            className="ghost-button"
            disabled={bloqueado}
            onClick={acceder}
          >
            {account ? 'Ir a perfil' : 'Iniciar sesión'}
          </button>
        </div>
      </header>

      <section className="hero-grid">
        <div className="hero-copy card">
          <p className="eyebrow">Gaming gear, periféricos y builds de alto nivel</p>
          <h1>Tu setup empieza con una tienda oscura, rápida y confiable.</h1>
          <p className="hero-text">
            Wepay es una tienda gamer pensada para mostrar hardware, periféricos
            y productos de alto rendimiento con un acceso privado basado en
            Microsoft Entra ID.
          </p>
          <div className="hero-actions">
            <button
              className="primary-button"
              disabled={bloqueado}
              onClick={acceder}
            >
              {account ? 'Ir al perfil' : 'Iniciar sesión'}
            </button>
            <a className="secondary-link" href="/perfil">
              Ver perfil
            </a>
          </div>
        </div>

        <aside className="hero-panel card">
          <p className="panel-label">Panel destacado</p>
          <h2>Acceso privado</h2>
          <p>
            Inicia sesión para entrar a tu perfil y probar la llamada segura al
            backend.
          </p>
          <div className="identity-box">
            <span className="identity-label">Sesión</span>
            <strong>{account ? account.username : 'No iniciada'}</strong>
            <span className="identity-hint">
              {account
                ? `MSAL listo · estado ${inProgress}`
                : 'La ruta privada queda protegida hasta iniciar sesión'}
            </span>
          </div>
        </aside>
      </section>
    </main>
  );
}

function PerfilPage() {
  const { instance, accounts, inProgress } = useMsal();
  const [perfil, setPerfil] = useState<{
    rol?: 'admin' | 'USER';
    nombre?: string;
    email?: string;
  } | null>(null);
  const [salidaPerfil, setSalidaPerfil] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const account = instance.getActiveAccount() ?? accounts[0];
  const bloqueado = ocupado || inProgress !== InteractionStatus.None;
  const esAdmin = perfil?.rol === 'admin';

  useEffect(() => {
    document.title = 'Wepay | Perfil';
  }, []);

  async function consultarPerfil() {
    if (!account) return;
    setOcupado(true);
    setSalidaPerfil('');
    setPerfil(null);
    try {
      const response = await fetchConToken(instance, account, '/api/perfil', {
        method: 'GET',
      });
      const texto = await response.text();
      if (!response.ok) {
        throw new Error(`Error perfil ${response.status}: ${texto}`);
      }
      const data = JSON.parse(texto) as {
        rol?: 'admin' | 'USER';
        nombre?: string;
        email?: string;
      };
      setPerfil(data);
      setSalidaPerfil(JSON.stringify(data, null, 2));
    } catch (error) {
      setSalidaPerfil(error instanceof Error ? error.message : String(error));
    } finally {
      setOcupado(false);
    }
  }

  async function salir() {
    if (account) {
      await instance.logoutPopup({ account });
    }
  }

  return (
    <main className="wepay-page">
      <header className="topbar">
        <div className="brand-lockup">
          <span className="brand-mark">W</span>
          <div>
            <p className="eyebrow">Perfil privado</p>
            <strong>Wepay</strong>
          </div>
        </div>
        <div className="topbar-actions">
          <span className="status-pill">Sesión privada</span>
          <button className="ghost-button" disabled={bloqueado} onClick={() => void salir()}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <section className="showcase-layout">
        <div className="catalog-section card">
          <div className="section-heading">
            <p className="eyebrow">Bienvenido</p>
            <h2>Panel de cliente</h2>
          </div>
          <p className="hero-text">
            {account
              ? `Usuario autenticado: ${account.username}`
              : 'No hay cuenta activa.'}
          </p>
          <div className="console-actions">
            <button className="primary-button" disabled={bloqueado} onClick={() => void consultarPerfil()}>
              Probar fetch con token
            </button>
          </div>
          <div className="console-output">
            <div>
              <span className="output-label">Respuesta /api/perfil</span>
              <pre>{salidaPerfil || 'Todavía no se ha ejecutado la prueba.'}</pre>
            </div>
          </div>

          <div className="hero-actions">
            {esAdmin ? (
              <button className="primary-button" disabled={bloqueado}>
                Panel de Administración Exclusivo
              </button>
            ) : (
              <div className="identity-hint">
                Tu cuenta tiene rol USER, así que ves la tienda y tu perfil, pero no el panel administrativo.
              </div>
            )}
          </div>
        </div>

        <aside className="access-console card">
          <div className="section-heading">
            <p className="eyebrow">Ruta protegida</p>
            <h2>Acceso con MSAL</h2>
          </div>
          <div className="identity-box">
            <span className="identity-label">Cuenta activa</span>
            <strong>{account ? account.username : 'No iniciada'}</strong>
            <span className="identity-hint">
              {inProgress === InteractionStatus.None
                ? 'Puedes consultar el backend protegido'
                : 'MSAL está procesando una interacción'}
            </span>
          </div>

          <div className="identity-box">
            <span className="identity-label">Rol</span>
            <strong>{perfil?.rol ?? 'Sin cargar'}</strong>
            <span className="identity-hint">
              {perfil
                ? 'La UI se adapta según el rol devuelto por el backend'
                : 'Ejecuta la prueba para cargar el rol'}
            </span>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/perfil"
        element={
          <RutaProtegida>
            <PerfilPage />
          </RutaProtegida>
        }
      />
    </Routes>
  );
}
