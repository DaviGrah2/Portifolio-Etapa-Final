import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import projects from '../data/projects'

export default function Project(){
  const { slug } = useParams()
  const project = projects.find(p=> p.slug === slug)
  if(!project) return <p className="text-brand-light/75">Projeto não encontrado.</p>

  return (
    <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="space-y-8">
      <div className="rounded-[2rem] border border-brand-accent/30 bg-[#12203b]/95 p-8 shadow-2xl shadow-brand-accent/10">
        <Link to="/projetos" className="text-sm text-brand-accent hover:text-brand-light">← Voltar aos projetos</Link>
        <h1 className="mt-4 text-4xl font-title font-bold text-brand-light">{project.title}</h1>
        <p className="mt-3 max-w-2xl text-brand-light/75">{project.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tech.map(tech => (
            <span key={tech} className="rounded-full bg-[#102741] px-4 py-2 text-sm text-brand-light ring-1 ring-brand-accent/30">{tech}</span>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6 rounded-[2rem] border border-brand-accent/20 bg-[#122842]/95 p-8 shadow-2xl shadow-brand-accent/10">
          <img src={project.thumbnail} alt={project.title} className="h-72 w-full rounded-3xl object-cover" />
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-title font-semibold text-brand-light">Objetivo do projeto</h2>
              <p className="mt-2 text-brand-light/75">Este projeto foi criado para demonstrar habilidades em criação de APIs, integração de front-end e geração de interfaces dinâmicas com React e backend.</p>
            </div>
            <div>
              <h2 className="text-xl font-title font-semibold text-brand-light">Descrição completa</h2>
              <p className="mt-2 text-brand-light/75">{project.description}</p>
            </div>
            <div>
              <h2 className="text-xl font-title font-semibold text-brand-light">Funcionalidades</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-brand-light/75">
                {project.features.map(f=> <li key={f}>{f}</li>)}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-title font-semibold text-brand-light">Desafios técnicos</h2>
              <p className="mt-2 text-brand-light/75">{project.challenges}</p>
            </div>
            <div>
              <h2 className="text-xl font-title font-semibold text-brand-light">Aprendizados</h2>
              <p className="mt-2 text-brand-light/75">{project.learnings}</p>
            </div>
          </section>
        </div>

        <aside className="space-y-6 rounded-[2rem] border border-brand-accent/20 bg-[#122842]/95 p-8 shadow-2xl shadow-brand-accent/10">
          <div className="space-y-3">
            <h2 className="text-xl font-title font-semibold text-brand-light">Links técnicos</h2>
            <a href={project.repo} target="_blank" rel="noreferrer" className="block rounded-2xl bg-brand-accent px-4 py-3 text-center text-sm font-semibold text-brand-dark transition hover:bg-brand-light">Ver repositório</a>
            <a href={project.deploy} target="_blank" rel="noreferrer" className="block rounded-2xl border border-brand-accent/40 px-4 py-3 text-center text-sm text-brand-light transition hover:border-brand-light hover:text-brand-light">Abrir deploy</a>
          </div>
          <div className="space-y-3 rounded-3xl bg-[#102741] p-5 text-brand-light/80 ring-1 ring-brand-accent/20">
            <h3 className="text-lg font-title font-semibold text-brand-light">Melhorias futuras</h3>
            <ul className="list-disc space-y-2 pl-5">
              <li>Adicionar autenticação segura com JWT</li>
              <li>Melhorar a validação de formulários</li>
              <li>Otimizar performance e deploy contínuo</li>
            </ul>
          </div>
        </aside>
      </div>
    </motion.article>
  )
}
