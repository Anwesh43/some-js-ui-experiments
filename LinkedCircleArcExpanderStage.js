const CAE_nodes = 5
const CAE_arcs = 4
const CAE_strokeFactor = 90
const CAE_sizeFactor = 3
const CAE_color = "#311B92"
const CAE_scDiv = 0.51
const CAE_scGap = 0.05

const CAE_divideScale = (scale, i, n) => Math.min(1/n, Math.max(0, scale - i / n)) * n

const CAE_scaleFactor = (scale) => Math.floor(scale / CAE_scDiv)

const CAE_mirrorValue = (scale, a, b) => (1 - CAE_scaleFactor(scale)) / a + CAE_scaleFactor(scale) / b

const CAE_updateScale = (scale, dir, a, b) => CAE_mirrorValue(scale, a, b) * dir * CAE_scGap
