import React, { SVGProps } from 'react'
import { createIcon } from '@consta/icons/Icon'

const IconExamplePlusSizeM = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M13 2h-2v9H2v2h9v9h2v-9h9v-2h-9V2z" />
  </svg>
)

const IconExamplePlusSizeXs = (props) => (<svg version="1.1" x="0px" y="0px" viewBox="0 0 72 90" enableBackground="new 0 0 72 72" xmlSpace="preserve"><g><path d="M45,42.8c-0.3,0-0.5,0-0.8,0.1l-3.9-7L37.4,41l2.3,4.2c-1,1.2-1.5,2.7-1.5,4.3c0,3.7,3,6.8,6.8,6.8c3.7,0,6.8-3,6.8-6.8   C51.7,45.8,48.7,42.8,45,42.8z M45,53.3c-2.1,0-3.8-1.7-3.8-3.8s1.7-3.8,3.8-3.8s3.8,1.7,3.8,3.8S47.1,53.3,45,53.3z"/><path d="M44.8,22.5c1.3-2.4,0.5-5.5-1.9-6.8L36,28.1l-6.8-12.3l0,0c-2.4,1.3-3.3,4.4-1.9,6.8l5.9,10.7l-5.3,9.6   c-0.3,0-0.6-0.1-0.9-0.1c-3.7,0-6.8,3-6.8,6.8c0,3.7,3,6.8,6.8,6.8s6.8-3,6.8-6.8c0-1.6-0.6-3.1-1.5-4.3L44.8,22.5z M27,53.3   c-2.1,0-3.8-1.7-3.8-3.8s1.7-3.8,3.8-3.8s3.8,1.7,3.8,3.8S29.1,53.3,27,53.3z"/></g></svg>
)
{/*<svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M6.5 2.5h-1v3h-3v1h3v3h1v-3h3v-1h-3v-3z" />
</svg>*/}




export default createIcon({
  name: 'IconCut',
  l: IconExamplePlusSizeM,
  m: IconExamplePlusSizeM,
  s: IconExamplePlusSizeXs,
  xs: IconExamplePlusSizeXs,
})