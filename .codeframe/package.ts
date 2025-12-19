import {
  BuildType,
  CPP_OUTPUT_DIR,
  runPackageAction,
  CMAKE_TOOLS,
  getHostSysrootPath,
  SYSROOT,
  PACKAGE_DIR,
  BuildConfiguration,
  LibraryInfo,
} from "../../../../src/providers/package.provider.ts";

import { join } from "node:path";
import { argv } from "node:process";

export const info: LibraryInfo = {
  name: "raylib",
  outDir: "build",
  version: "5.5.0",
};

export const build = (cwd: string = process.cwd()): BuildType => {
  const HOST_SYSROOT = getHostSysrootPath();
  const CLANG = join(HOST_SYSROOT, "bin/clang.exe").replace(/\\/g, "/");
  const CLANGXX = join(HOST_SYSROOT, "bin/clang++.exe").replace(/\\/g, "/");

  return {
    type: "compilation",
    windows_x86_64: {
      configStep: `cmake -S . -B ${info.outDir}/windows/x86_64 -G Ninja \
      -DCMAKE_BUILD_TYPE=Release \
      -DBUILD_SHARED_LIBS=OFF \
      -DBUILD_EXAMPLES=OFF \
      -DCMAKE_SYSTEM_NAME=Windows \
      -DCMAKE_C_COMPILER=${CLANG} \
      -DCMAKE_CXX_COMPILER=${CLANGXX} \
      -DCMAKE_C_COMPILER_TARGET=x86_64-w64-windows-gnu \
      -DCMAKE_CXX_COMPILER_TARGET=x86_64-w64-windows-gnu \
      -DCMAKE_PREFIX_PATH=${CPP_OUTPUT_DIR}/windows/x86_64/zlib \
      -DCMAKE_INSTALL_PREFIX=${CPP_OUTPUT_DIR}/${info.name}/windows/x86_64
      `,
      buildStep: `cmake --build ${info.outDir}/windows/x86_64 -j --target ${info.name}`,
      installStep: `cmake --install ${info.outDir}/windows/x86_64`,
    },
    windows_aarch64: {
      configStep: `cmake -S . -B ${info.outDir}/windows/aarch64 -G Ninja \
      -DCMAKE_BUILD_TYPE=Release \
      -DBUILD_SHARED_LIBS=OFF \
      -DBUILD_EXAMPLES=OFF \
      -DCMAKE_SYSTEM_NAME=Windows \
      -DCMAKE_C_COMPILER=${CLANG} \
      -DCMAKE_CXX_COMPILER=${CLANGXX} \
      -DCMAKE_RC_FLAGS=--target=aarch64-w64-mingw32 \
      -DCMAKE_C_COMPILER_TARGET=aarch64-w64-windows-gnu \
      -DCMAKE_CXX_COMPILER_TARGET=aarch64-w64-windows-gnu \
      -DCMAKE_SYSTEM_PROCESSOR=aarch64 \
      -DCMAKE_INSTALL_PREFIX=${CPP_OUTPUT_DIR}/${info.name}/windows/aarch64
      `,
      buildStep: `cmake --build ${info.outDir}/windows/aarch64 -j --target ${info.name}`,
      installStep: `cmake --install ${info.outDir}/windows/aarch64`,
    },
    linux_x86_64: {
      configStep: `cmake -S . -B build/linux/x86_64 -G Ninja \
      -DCMAKE_TOOLCHAIN_FILE=${CMAKE_TOOLS}/linux_x86-64.cmake \
      -DCMAKE_BUILD_TYPE=Release \
      -DBUILD_SHARED_LIBS=OFF \
      -DBUILD_EXAMPLES=OFF \
      -DGLFW_BUILD_X11=ON \ 
      -DGLFW_BUILD_WAYLAND=OFF \
      -DCMAKE_C_COMPILER=${CLANG} \
      -DCMAKE_CXX_COMPILER=${CLANGXX} \
      -DX11_X11_INCLUDE_PATH=${SYSROOT.linux_x86_64}/include \
      -DX11_X11_LIB=${SYSROOT.linux_x86_64}/lib/x86_64-linux-gnu/libX11.so \
      -DCMAKE_C_COMPILER_TARGET=x86_64-unknown-linux-gnu \
      -DCMAKE_CXX_COMPILER_TARGET=x86_64-unknown-linux-gnu \
      -DCMAKE_INSTALL_PREFIX=${CPP_OUTPUT_DIR}/${info.name}/linux/x86_64
      `,

      buildStep: `cmake --build ${info.outDir}/linux/x86_64 -j --target ${info.name}`,
      installStep: `cmake --install ${info.outDir}/linux/x86_64`,
    },
    linux_aarch64: {
      configStep: `cmake -S . -B build/linux/aarch64 -G Ninja \
      -DCMAKE_TOOLCHAIN_FILE=${CMAKE_TOOLS}/linux_aarch64.cmake \
      -DCMAKE_BUILD_TYPE=Release \
      -DBUILD_SHARED_LIBS=OFF \
      -DBUILD_EXAMPLES=OFF \
      -DGLFW_BUILD_X11=ON \ 
      -DGLFW_BUILD_WAYLAND=OFF \
      -DCMAKE_C_COMPILER=${CLANG} \
      -DCMAKE_CXX_COMPILER=${CLANGXX} \
      -DX11_X11_INCLUDE_PATH=${SYSROOT.linux_aarch64}/include \
      -DX11_X11_LIB=${SYSROOT.linux_aarch64}/lib/aarch64-linux-gnu/libX11.so \
      -DCMAKE_C_COMPILER_TARGET=aarch64-unknown-linux-gnu \
      -DCMAKE_CXX_COMPILER_TARGET=aarch64-unknown-linux-gnu \
      -DCMAKE_RC_FLAGS=--target=aarch64-w64-mingw32 \
      -DCMAKE_INSTALL_PREFIX=${CPP_OUTPUT_DIR}/${info.name}/linux/aarch64
      `,
      buildStep: `cmake --build ${info.outDir}/linux/aarch64 -j --target ${info.name}`,
      installStep: `cmake --install ${info.outDir}/linux/aarch64`,
    },
  } satisfies BuildType;
};

const args = argv.slice(2);
const [action = "help"] = args;

const buildConfig: BuildConfiguration = {
  info,
  build: build(),
};

await runPackageAction(action, process.cwd(), buildConfig);
