/**
 * Workspace helpers — partner name resolution & display
 */

/**
 * Ambil nama tampilan pasangan A (nickname jika ada, fallback ke nama utama)
 * @param {object} workspace
 * @returns {string}
 */
export function getPartnerADisplay(workspace) {
  if (!workspace) return 'Pasangan A'
  return workspace.partner_a_nickname?.trim() || workspace.partner_a_name?.trim() || 'Pasangan A'
}

/**
 * Ambil nama tampilan pasangan B
 * @param {object} workspace
 * @returns {string}
 */
export function getPartnerBDisplay(workspace) {
  if (!workspace) return 'Pasangan B'
  return workspace.partner_b_nickname?.trim() || workspace.partner_b_name?.trim() || 'Pasangan B'
}

/**
 * Welcome message: "Halo Budi & Ani" atau "Halo Budi"
 * @param {object} workspace
 * @returns {string}
 */
export function getWelcomeMessage(workspace) {
  if (!workspace) return 'Halo!'
  const relationshipName = workspace.relationship_name?.trim()
  if (relationshipName) return `Halo, ${relationshipName}!`

  const a = getPartnerADisplay(workspace)
  const b = getPartnerBDisplay(workspace)
  if (b && b !== 'Pasangan B') return `Halo, ${a} & ${b}!`
  return `Halo, ${a}!`
}

/**
 * Label assignee berdasarkan workspace
 * @param {string} assignee
 * @param {object} workspace
 * @returns {string}
 */
export function getAssigneeLabel(assignee, workspace) {
  if (assignee === 'berdua')    return '👫 Berdua'
  if (assignee === 'pasanganA') return `👤 ${getPartnerADisplay(workspace)}`
  if (assignee === 'pasanganB') return `👤 ${getPartnerBDisplay(workspace)}`
  if (assignee === 'keluarga')  return '👨‍👩‍👧 Keluarga'
  return assignee
}
