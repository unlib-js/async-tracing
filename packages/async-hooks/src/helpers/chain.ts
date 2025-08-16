import { StackFrame } from '../types'

export function childrenOf(root: StackFrame | number, frames: StackFrame[]) {
  root = typeof root === 'number' ? root : root.id
  return frames.filter(frame => frame.parent === root)
}

export function firstChildOf(root: StackFrame | number, frames: StackFrame[]) {
  root = typeof root === 'number' ? root : root.id
  return frames.find(frame => frame.parent === root)
}

export function parentOf(frame: StackFrame, frames: Map<number, StackFrame>) {
  return frames.get(frame.parent)
}

export function chainFromLeaf(leaf: StackFrame, frames: Map<number, StackFrame>) {
  const childFirstChain: StackFrame[] = [leaf]
  let parent = frames.get(leaf.parent)
  while (parent) {
    childFirstChain.push(parent)
    parent = frames.get(parent.parent)
  }
  return childFirstChain
}

export function chainFromRoot(root: StackFrame, frames: Map<number, StackFrame>) {
  const parentFirstChain: StackFrame[] = [root]
  const mFrames = [...frames.values()]
  let child = firstChildOf(root, mFrames)
  while (child) {
    parentFirstChain.push(child)
    child = firstChildOf(child, mFrames)
  }
  return parentFirstChain.reverse()
}
