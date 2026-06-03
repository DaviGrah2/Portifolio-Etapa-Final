import React from 'react'
import { Link } from 'react-router-dom'

export default function ProjectCard({project}){
  return (
    <article style={{ perspective: '800px' }} className="group rounded-[2rem] border border-brand-accent/20 bg-[#0f1f3b]/90 shadow-lg shadow-brand-accent/10 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">
      <div className="transform-gpu transition duration-500 group-hover:-rotate-2 group-hover:scale-[1.015]">
        <div className="overflow-hidden rounded-[1.8rem] border border-brand-accent/10 bg-[#102741]/95">
          <img src={project.thumbnail} alt="thumbnail" className="w-full h-44 object-cover transition duration-500 group-hover:scale-105" />
        </div>
        <div className="p-5">
          <h3 className="font-title text-2xl font-semibold text-brand-light">{project.title}</h3>
          <p className="mt-3 text-sm text-brand-light/75">{project.short}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {project.tech.map(t=> (
              <span key={t} className="text-xs bg-[#122741] text-brand-light/80 px-2 py-1 rounded">{t}</span>
            ))}
          </div>
          <Link to={`/projeto/${project.slug}`} className="mt-6 inline-flex items-center text-brand-accent transition hover:text-brand-light">
            Ver detalhes →
          </Link>
        </div>
      </div>
    </article>
  )
}
