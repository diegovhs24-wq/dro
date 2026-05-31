/** Returns a React component that renders a preview image for a page builder block.
 *  Pass the returned component as `media` inside a schema's `preview.prepare()`.
 *  Images live in /public/block-previews/<name>.png
 */
export function blockPreview(src: string) {
  function BlockPreviewImage() {
    return (
      <img
        src={src}
        alt=""
        style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
      />
    )
  }
  return BlockPreviewImage
}
