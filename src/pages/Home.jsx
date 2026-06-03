import React, { Suspense, useCallback, lazy } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
const WorldScene = lazy(() => import('../components/Scene/WorldScene'))
import ParticleBackground from '../components/Scene/ParticleBackground'
import HolographicText from '../components/UI/HolographicText'
import HolographicCard from '../components/UI/HolographicCard'
import AnimatedCounter from '../components/UI/AnimatedCounter'
import SkillOrb from '../components/UI/SkillOrb'
import Timeline from '../components/UI/Timeline'
import GlassButton from '../components/UI/GlassButton'
import { useColorPalette } from '../context/ColorPaletteContext'
import { useAI } from '../context/AIContext'
import AvatarAssistant from '../components/AvatarAssistant'
import { profile } from '../data/profile'
import { skills as skillList } from '../data/skills'
import projects from '../data/projects'

export default function Home() {
  const { palette } = useColorPalette()
  const {
    assistantText,
    avatarAction,
    speechLevel,
    sendMessage,
  } = useAI()

  const handleSceneSelect = useCallback(
    (section) => {
      sendMessage(`Leve-me para a seção ${section}`)
    },
    [sendMessage]
  )

  return (
    <section className="space-y-20 relative z-10 pt-12" id="home">
      <ParticleBackground />

      <div
        className="relative overflow-hidden rounded-[3rem] border p-8 lg:p-12 shadow-2xl bg-[#050816]/80"
        style={{
          borderColor: palette.border,
          backgroundImage: `radial-gradient(circle at top left, ${palette.glow}, transparent 35%), radial-gradient(circle at 80% 20%, ${palette.accent}15, transparent 28%)`,
        }}
      >
        <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-8">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium tracking-wider border"
              style={{
                borderColor: palette.primary,
                backgroundColor: `${palette.primary}20`,
                color: palette.primary,
              }}
            >
              Portfólio imersivo com IA
            </motion.span>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h1 className="text-5xl md:text-6xl font-title font-black leading-tight">
                <HolographicText text="Olá, eu sou" />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  style={{ color: palette.primary }}
                >
                  {profile.name}
                </motion.div>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-xl leading-relaxed text-lg"
              style={{ color: palette.textMuted }}
            >
              {profile.tagline} Navegue por um ambiente 3D interativo, acompanhe nosso avatar-guia e descubra projetos, habilidades e comunicação.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link to="/projetos">
                <GlassButton variant="primary">Ver Projetos</GlassButton>
              </Link>
              <Link to="/contato">
                <GlassButton variant="outline">Vamos Conversar</GlassButton>
              </Link>
            </motion.div>

            <motion.div
              className="grid gap-4 sm:grid-cols-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, staggerChildren: 0.1 }}
            >
              {['IA', '3D', 'UX', 'Performance'].map((label, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="rounded-3xl p-5 border backdrop-blur-xl"
                  style={{
                    borderColor: palette.border,
                    backgroundColor: `${palette.primary}10`,
                  }}
                >
                  <p className="text-xs uppercase tracking-wider" style={{ color: palette.secondary }}>
                    {label}
                  </p>
                  <p className="mt-2 text-sm" style={{ color: palette.textMuted }}>
                    Experiência com design cinematográfico, interatividade e identidade digital.
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#08101f]/95 shadow-2xl shadow-slate-900/30">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(147,51,234,0.18),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(56,189,248,0.16),transparent_30%)]" />

            <div className="relative h-[650px] w-full">
              <Suspense fallback={<div className="h-full w-full flex items-center justify-center text-white/70">Carregando experiência 3D...</div>}>
                <WorldScene action={avatarAction} talkLevel={speechLevel} selectedSection={null} onSectionSelect={handleSceneSelect} />
              </Suspense>
            </div>

            <div className="absolute left-6 right-6 bottom-6">
              <AvatarAssistant />
            </div>
          </div>
        </div>
      </div>

      <section id="metrics" className="grid gap-6 md:grid-cols-3">
        <AnimatedCounter value={projects.length} label="Projetos ativos" icon="🚀" />
        <AnimatedCounter value={skillList.length} label="Habilidades dominadas" icon="⚡" />
        <AnimatedCounter value={profile.experience.length} label="Anos de evolução" icon="🌌" />
      </section>

      <section id="journey" className="space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs uppercase tracking-wider" style={{ color: palette.secondary }}>
            Jornada
          </p>
          <h2 className="mt-3 text-4xl font-title font-bold">
            <HolographicText text="Linha do tempo da evolução" />
          </h2>
          <p className="mt-4 max-w-3xl leading-relaxed" style={{ color: palette.textMuted }}>
            Um mapa visual da jornada técnica e criativa que conduziu à criação deste portfólio futurista.
          </p>
        </motion.div>

        <Timeline
          events={profile.experience.map((item, index) => ({
            title: item.description,
            subtitle: `Marco ${index + 1}`,
            date: item.year,
            description: item.description,
            tags: ['3D', 'Motion', 'UX'],
          }))}
        />
      </section>

      <section id="about" className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="rounded-[2rem] border p-8 backdrop-blur-xl"
          style={{
            borderColor: palette.border,
            backgroundColor: `${palette.dark}80`,
          }}
        >
          <p className="text-xs uppercase tracking-wider" style={{ color: palette.secondary }}>
            Sobre
          </p>
          <h2 className="mt-3 text-4xl font-title font-bold">
            <HolographicText text="Conectando tecnologia e narrativa visual" />
          </h2>
          <p className="mt-4 leading-8" style={{ color: palette.textMuted }}>
            Sou um desenvolvedor que usa a linguagem da experiência 3D para contar histórias digitais. Cada seção do portfólio foi pensada para parecer um mundo virtual vivo e interativo.
          </p>
        </motion.article>

        <motion.aside
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
          className="space-y-6 rounded-[2rem] border p-8 backdrop-blur-xl"
          style={{
            borderColor: palette.border,
            backgroundColor: `${palette.dark}80`,
          }}
        >
          <p className="text-xs uppercase tracking-wider" style={{ color: palette.secondary }}>
            Detalhes
          </p>
          <div className="grid gap-4">
            {profile.experience.map((item) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="rounded-[1.7rem] border p-5 backdrop-blur-sm"
                style={{
                  borderColor: palette.border,
                  backgroundColor: `${palette.primary}10`,
                }}
              >
                <p className="text-xs uppercase tracking-wider" style={{ color: palette.secondary }}>
                  {item.year}
                </p>
                <p className="mt-2" style={{ color: palette.textMuted }}>
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.aside>
      </section>

      <section id="skills" className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs uppercase tracking-wider" style={{ color: palette.secondary }}>
            Skills
          </p>
          <h2 className="mt-2 text-4xl font-title font-bold">
            <HolographicText text="Tecnologias com identidade visual" />
          </h2>
        </motion.div>

        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {skillList.map((item, index) => (
            <SkillOrb key={item.id} name={item.name} icon="⚡" level={90 - index * 5} />
          ))}
        </motion.div>
      </section>

      <section id="projects" className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs uppercase tracking-wider" style={{ color: palette.secondary }}>
            Projetos
          </p>
          <h2 className="mt-2 text-4xl font-title font-bold">
            <HolographicText text="Estação de trabalhos futuristas" />
          </h2>
          <p className="max-w-2xl mt-4" style={{ color: palette.textMuted }}>
            Explore projetos através de ilhas conceptuais que apresentam cada caso com estilo holográfico.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-6 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {projects.slice(0, 3).map((project) => (
            <HolographicCard key={project.slug} title={project.title} description={project.description} icon="🎮" />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <Link to="/projetos">
            <GlassButton variant="accent">Ver Todos os Projetos</GlassButton>
          </Link>
        </motion.div>
      </section>

      <section
        id="contact-cta"
        className="rounded-[2rem] border p-8 lg:p-12 backdrop-blur-xl"
        style={{
          borderColor: palette.border,
          backgroundColor: `${palette.dark}80`,
          backgroundImage: `linear-gradient(135deg, ${palette.primary}20, ${palette.accent}20)`,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl"
        >
          <h2 className="text-4xl font-title font-bold mb-4">
            <HolographicText text="Vamos criar algo juntos?" />
          </h2>
          <p className="mb-6 leading-8" style={{ color: palette.textMuted }}>
            Se você quiser transformar sua próxima ideia em experiência digital cinematográfica, estou pronto para conversar e apresentar as melhores soluções.
          </p>
          <Link to="/contato">
            <GlassButton variant="primary">Iniciar Conversa</GlassButton>
          </Link>
        </motion.div>
      </section>
    </section>
  )
}
