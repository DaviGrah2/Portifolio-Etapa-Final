import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import HolographicCard from '../components/UI/HolographicCard'
import HolographicText from '../components/UI/HolographicText'
import ParticleBackground from '../components/Scene/ParticleBackground'
import GlowingBadge from '../components/UI/GlowingBadge'
import GlassButton from '../components/UI/GlassButton'
import { useColorPalette } from '../context/ColorPaletteContext'
import projects from '../data/projects'

export default function Projects() {
  const { palette } = useColorPalette()
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['all', 'web', 'mobile', 'game', 'interactive']
  const filteredProjects =
    selectedCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === selectedCategory)

  return (
    <section id="projects" className="space-y-16 relative z-10 pt-12">
      <ParticleBackground />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <p className="text-xs uppercase tracking-wider" style={{ color: palette.secondary }}>
          Catálogo de Projetos
        </p>
        <h1 className="mt-3 text-5xl md:text-6xl font-title font-black leading-tight">
          <HolographicText text="Estação Interativa de Trabalhos" />
        </h1>
        <p className="mt-4 max-w-3xl leading-relaxed" style={{ color: palette.textMuted }}>
          Explore uma coleção de projetos desenvolvidos com foco em experiência cinematográfica, interatividade
          imersiva e arquitetura de código profissional. Cada projeto representa um mundo digital único.
        </p>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-3"
      >
        {categories.map((cat) => (
          <motion.button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className="relative px-6 py-3 rounded-full font-bold uppercase tracking-wider transition-all"
            style={{
              backgroundColor:
                selectedCategory === cat
                  ? palette.primary
                  : `${palette.primary}10`,
              color:
                selectedCategory === cat ? palette.dark : palette.primary,
              border: `2px solid ${palette.primary}`,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </motion.button>
        ))}
      </motion.div>

      {/* Projects Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
        className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3"
      >
        {filteredProjects.map((project) => (
          <motion.article
            key={project.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="group relative rounded-[2rem] border p-6 backdrop-blur-xl overflow-hidden cursor-pointer"
            style={{
              borderColor: palette.border,
              backgroundColor: `${palette.dark}80`,
            }}
          >
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-60"
              style={{
                background: `linear-gradient(135deg, ${palette.primary}20, ${palette.accent}20)`,
              }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Content */}
            <div className="relative z-10 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p
                    className="text-xs uppercase tracking-wider"
                    style={{ color: palette.secondary }}
                  >
                    {project.role}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-white">
                    {project.title}
                  </h3>
                </div>
                <motion.div
                  className="text-3xl"
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  🎮
                </motion.div>
              </div>

              <p style={{ color: palette.textMuted }}>
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {(project.tags || project.tech || [])
                  .slice(0, 4)
                  .map((tag) => (
                    <GlowingBadge
                      key={tag}
                      text={tag}
                      variant="primary"
                      animated={false}
                    />
                  ))}
              </div>

              {/* Links */}
              <div className="flex gap-2 pt-4">
                <Link to={`/projeto/${project.slug}`} className="flex-1">
                  <GlassButton variant="primary" className="w-full">
                    Detalhes
                  </GlassButton>
                </Link>
                {project.link && (
                  <a href={project.link} target="_blank" rel="noreferrer" className="flex-1">
                    <GlassButton variant="outline" className="w-full">
                      Ao Vivo
                    </GlassButton>
                  </a>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="rounded-[2rem] border p-8 lg:p-12 backdrop-blur-xl text-center"
        style={{
          borderColor: palette.border,
          backgroundColor: `${palette.dark}80`,
          backgroundImage: `linear-gradient(135deg, ${palette.primary}20, ${palette.accent}20)`,
        }}
      >
        <h2 className="text-4xl font-title font-bold mb-4">
          <HolographicText text="Quer iniciar um novo projeto?" />
        </h2>
        <p className="max-w-2xl mx-auto mb-6 leading-8" style={{ color: palette.textMuted }}>
          Estou disponível para discutir ideias, desenvolver soluções criativas e transformar sua visão em realidade
          digital cinematográfica.
        </p>
        <Link to="/contato">
          <GlassButton variant="primary">Entrar em Contato</GlassButton>
        </Link>
      </motion.section>
    </section>
  )
}
