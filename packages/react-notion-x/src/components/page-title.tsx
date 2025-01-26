import { type Block, type Decoration } from 'notion-types'
import {
  getBlockTitle
} from 'notion-utils'
import * as React from 'react'

import { useNotionContext } from '../context'
import { Property } from '../third-party/property'
import { usePropertyContext } from '../third-party/propertyContext'
import { cs } from '../utils'
import { PageIcon } from './page-icon'
import { Text } from './text'

export function PageTitleImpl({
  block,
  className,
  defaultIcon,
  ...rest
}: {
  block: Block
  className?: string
  defaultIcon?: string | null
}) {
  const { recordMap } = useNotionContext()
  const {
    block: propertyBlock,
    collection,
    propertyId
  } = usePropertyContext()

  let collectionId = null
  if (propertyBlock?.parent_table === 'collection') {
    collectionId = propertyBlock.parent_id
  }


  if (!block) return null

  if (
    block.type === 'collection_view_page' ||
    block.type === 'collection_view'
  ) {
    const title = getBlockTitle(block, recordMap)
    if (!title) {

      return null
    }

    const titleDecoration: Decoration[] = [[title]]

    return (
      <span className={cs('notion-page-title', className)} {...rest}>
        <PageIcon
          block={block}
          defaultIcon={defaultIcon}
          className='notion-page-title-icon'
        />

        <span className='notion-page-title-text'>
          <Text value={titleDecoration} block={block} />
        </span>
      </span>
    )
  }

  if (!block.properties?.title) {

    return null
  }


  let properties = null;
  if (collectionId && propertyId) {
    const currentCollection = collection
    const propertiesToRender = currentCollection?.format?.collection_relation_options?.[
      propertyId
    ]?.related_properties.filter((property) => property.visible && property.property !== 'title')
    const targetCollectionId = currentCollection?.schema[propertyId]?.collection_pointer?.id!
    const targetCollection = recordMap?.collection[targetCollectionId]?.value
    const targetSchema = targetCollection?.schema!

    properties =
      propertiesToRender?.map(({ property }, index) => {
        const data = block.properties?.[property]
        if (!data) {
          return null
        }
        return (
          <>
            <Property
              key={property}
              schema={targetSchema[property]}
              propertyId={property}
              data={block.properties?.[property]}
              collection={targetCollection}
              block={block}
            />
            {/* TODO: Make separator prettier */}
            {index !== propertiesToRender.length - 1 && <span>/</span>}
          </>
        )
      }) || []
  }

  return (
    <span className={cs('notion-page-title', className)} {...rest}>
      <span className='notion-page-title-text'>
        {/* <Text value={block.properties?.title} block={block} /> */}
        {properties}
      </span>
    </span>
  )
}

export const PageTitle = React.memo(PageTitleImpl)
