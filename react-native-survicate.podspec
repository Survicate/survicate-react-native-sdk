require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-survicate"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  React Native bindings for Survicate Mobile SDK
                   DESC
  s.homepage     = "https://github.com/Survicate/react-native-survicate"
  s.license      = "MIT"
  # s.license    = { :type => "MIT", :file => "FILE_LICENSE" }
  s.authors      = { "Survicate" => "help@survicate.com" }
  s.platforms    = { :ios => "10.0" }
  s.source       = { :git => "https://github.com/Survicate/react-native-survicate.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,swift}"
  s.requires_arc = true

  s.dependency "React"
  s.dependency "Survicate", "1.6.1"
  # ...
  # s.dependency "..."
end

