import React, { useState, forwardRef } from 'react'

const LazyImage = forwardRef(function LazyImage({ src, alt = '', className = '', style = {}, placeholder, ...rest }, ref){
  const [loaded, setLoaded] = useState(false)

  const background = !loaded && placeholder ? { backgroundImage: `url(${placeholder})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      loading="lazy"
      className={`${className} blur-up ${loaded ? 'is-loaded' : ''}`}
      style={{ ...style, ...background }}
      onLoad={() => setLoaded(true)}
      {...rest}
    />
  )
})

export default LazyImage
